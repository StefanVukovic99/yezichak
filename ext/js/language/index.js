/*
 * Copyright (C) 2024  Yomitan Authors
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

import {textTransformations as textTransformationsEN} from './en/text-transformations.js';
import {textTransformations as textTransformationsJA} from './ja/text-transformations.js';

/** @type {Map<string, import('language').Language>} */
export const languages = new Map([
    ['ja', {
        name: 'Japanese',
        iso: 'ja',
        flag: '🇯🇵',
        exampleText: '読め',
        textTransformations: textTransformationsJA
    }],
    ['en', {
        name: 'English',
        iso: 'en',
        flag: '🇬🇧',
        exampleText: 'read',
        textTransformations: textTransformationsEN
    }]
]);

