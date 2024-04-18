/*
 * Copyright (C) 2023-2024  Yomitan Authors
 * Copyright (C) 2020-2022  Yomichan Authors
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

import {germanTransforms} from '../../ext/js/language/de/german-transforms.js';
import {LanguageTransformer} from '../../ext/js/language/language-transformer.js';
import {testLanguageTransformer} from '../fixtures/language-transformer-test.js';

/* eslint-disable @stylistic/no-multi-spaces */
const tests = [
    {
        category: 'adjectives',
        valid: true,
        tests: [
            {term: 'trennen', source: 'trennbar',  rule: null, reasons: null}
        ]
    }
];
/* eslint-enable @stylistic/no-multi-spaces */

const languageTransformer = new LanguageTransformer();
languageTransformer.addDescriptor(germanTransforms);
testLanguageTransformer(languageTransformer, tests);