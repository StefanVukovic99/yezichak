/*
 * Copyright (C) 2023  Yomitan Authors
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

import Ajv from 'ajv';
import standaloneCode from 'ajv/dist/standalone/index.js';
import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const extDir = path.join(dirname, '..', 'ext');

async function buildLib(p) {
    await esbuild.build({
        entryPoints: [p],
        bundle: true,
        minify: false,
        sourcemap: true,
        target: 'es2020',
        format: 'esm',
        outfile: path.join(extDir, 'lib', path.basename(p)),
        external: ['fs']
    });
}

export async function buildLibs() {
    const devLibPath = path.join(dirname, 'lib');
    const files = await fs.promises.readdir(devLibPath, {
        withFileTypes: true
    });
    for (const f of files) {
        if (f.isFile()) {
            await buildLib(path.join(devLibPath, f.name));
        }
    }

    const schemaDir = path.join(extDir, 'data/schemas/');
    const schemaFileNames = fs.readdirSync(schemaDir);
    const schemas = schemaFileNames.map((schemaFileName) => JSON.parse(fs.readFileSync(path.join(schemaDir, schemaFileName))));
    const ajv = new Ajv({schemas: schemas, code: {source: true, esm: true}});
    const moduleCode = standaloneCode(ajv);

    // https://github.com/ajv-validator/ajv/issues/2209
    const patchedModuleCode = "import {ucs2length} from './ucs2length.js';" + moduleCode.replaceAll('require("ajv/dist/runtime/ucs2length").default', 'ucs2length');

    fs.writeFileSync(path.join(extDir, 'lib/validate-schemas.js'), patchedModuleCode);
}
