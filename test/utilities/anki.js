/*
 * Copyright (C) 2023-2024  Yomitan Authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {AnkiNoteBuilder} from '../../ext/js/data/anki-note-builder.js';
import {createAnkiNoteData} from '../../ext/js/data/sandbox/anki-note-data-creator.js';
import {AnkiTemplateRenderer} from '../../ext/js/templates/sandbox/anki-template-renderer.js';

/**
 * @param {import('dictionary').DictionaryEntry} dictionaryEntry
 * @param {import('settings').ResultOutputMode} mode
 * @returns {import('anki-templates').NoteData}
 * @throws {Error}
 */
export function createTestAnkiNoteData(dictionaryEntry, mode) {
    const marker = '{marker}';
    /** @type {import('anki-templates-internal').CreateDetails} */
    const data = {
        dictionaryEntry,
        resultOutputMode: mode,
        mode: 'test',
        glossaryLayoutMode: 'default',
        compactTags: false,
        context: {
            url: 'url:',
            sentence: {text: '', offset: 0},
            documentTitle: 'title',
            query: 'query',
            fullQuery: 'fullQuery'
        },
        media: {}
    };
    return createAnkiNoteData(marker, data);
}

/**
 * @param {'terms'|'kanji'} type
 * @returns {string[]}
 */
function getFieldMarkers(type) {
    switch (type) {
        case 'terms':
            return [
                'audio',
                'clipboard-image',
                'clipboard-text',
                'cloze-body',
                'cloze-prefix',
                'cloze-suffix',
                'conjugation',
                'dictionary',
                'document-title',
                'expression',
                'frequencies',
                'frequency-harmonic-rank',
                'frequency-harmonic-occurrence',
                'frequency-average-rank',
                'frequency-average-occurrence',
                'furigana',
                'furigana-plain',
                'glossary',
                'glossary-brief',
                'glossary-no-dictionary',
                'part-of-speech',
                'pitch-accents',
                'pitch-accent-graphs',
                'pitch-accent-positions',
                'phonetic-transcriptions',
                'reading',
                'screenshot',
                'search-query',
                'selection-text',
                'sentence',
                'sentence-furigana',
                'tags',
                'url'
            ];
        case 'kanji':
            return [
                'character',
                'clipboard-image',
                'clipboard-text',
                'cloze-body',
                'cloze-prefix',
                'cloze-suffix',
                'dictionary',
                'document-title',
                'frequencies',
                'frequency-harmonic-rank',
                'frequency-harmonic-occurrence',
                'frequency-average-rank',
                'frequency-average-occurrence',
                'glossary',
                'kunyomi',
                'onyomi',
                'screenshot',
                'search-query',
                'selection-text',
                'sentence',
                'sentence-furigana',
                'stroke-count',
                'tags',
                'url'
            ];
        default:
            return [];
    }
}

/**
 * @param {import('dictionary').DictionaryEntry[]} dictionaryEntries
 * @param {'terms'|'kanji'} type
 * @param {import('settings').ResultOutputMode} mode
 * @param {string} template
 * @param {?import('vitest').ExpectStatic} expect
 * @returns {Promise<import('anki').NoteFields[]>}
 */
export async function getTemplateRenderResults(dictionaryEntries, type, mode, template, expect) {
    const markers = getFieldMarkers(type);
    /** @type {import('anki-note-builder').Field[]} */
    const fields = [];
    for (const marker of markers) {
        fields.push([marker, `{${marker}}`]);
    }

    const ankiTemplateRenderer = new AnkiTemplateRenderer();
    await ankiTemplateRenderer.prepare();
    const clozePrefix = 'cloze-prefix';
    const clozeSuffix = 'cloze-suffix';
    const results = [];
    for (const dictionaryEntry of dictionaryEntries) {
        let source = '';
        switch (dictionaryEntry.type) {
            case 'kanji':
                source = dictionaryEntry.character;
                break;
            case 'term':
                if (dictionaryEntry.headwords.length > 0 && dictionaryEntry.headwords[0].sources.length > 0) {
                    source = dictionaryEntry.headwords[0].sources[0].originalText;
                }
                break;
        }
        const api = new MinimalApi();
        const ankiNoteBuilder = new AnkiNoteBuilder(api, ankiTemplateRenderer.templateRenderer);
        const context = {
            url: 'url:',
            sentence: {
                text: `${clozePrefix}${source}${clozeSuffix}`,
                offset: clozePrefix.length
            },
            documentTitle: 'title',
            query: 'query',
            fullQuery: 'fullQuery'
        };
        /** @type {import('anki-note-builder').CreateNoteDetails} */
        const details = {
            dictionaryEntry,
            mode: 'test',
            context,
            template,
            deckName: 'deckName',
            modelName: 'modelName',
            fields,
            tags: ['yomitan'],
            checkForDuplicates: true,
            duplicateScope: 'collection',
            duplicateScopeCheckAllModels: false,
            resultOutputMode: mode,
            glossaryLayoutMode: 'default',
            compactTags: false,
            requirements: [],
            mediaOptions: null
        };
        const {note: {fields: noteFields}, errors} = await ankiNoteBuilder.createNote(details);
        for (const error of errors) {
            console.error(error);
        }
        if (expect !== null) {
            expect(errors.length).toStrictEqual(0);
        }
        results.push(noteFields);
    }

    return results;
}

class MinimalApi {
    /**
     * @type {import('anki-note-builder.js').MinimalApi['injectAnkiNoteMedia']}
     */
    async injectAnkiNoteMedia() {
        throw new Error('Not supported');
    }

    /**
     * @type {import('anki-note-builder.js').MinimalApi['parseText']}
     */
    async parseText() {
        throw new Error('Not supported');
    }
}
