/*
 * Copyright (C) 2016-2022  Yomichan Authors
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

/* global
 */


export const decapitalize = {
    id: 'decapitalize',
    name: 'Decapitalize text',
    description: 'CAPITALIZED TEXT → capitalized text',
    options: {
        false: 'Disabled',
        true: 'Enabled',
        variant: 'Use both variants'
    },
    transform: (str) => str.toLowerCase()
};

export const capitalizeFirstLetter = {
    id: 'capitalizeFirstLetter',
    name: 'Capitalize first letter',
    description: 'lowercase text → Lowercase text',
    options: {
        false: 'Disabled',
        true: 'Enabled',
        variant: 'Use both variants'
    },
    transform: (str) => str.charAt(0).toUpperCase() + str.slice(1)
};