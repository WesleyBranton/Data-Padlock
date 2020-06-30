/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const config = {
    version: 3,
    mode: 'AES-GCM',
    ivSize: 12,
    saltSize: 32,
    fileExtension: '.dpl',
    maxMetaLengthDigits: 2,
    flag: {
        full: 'DPL003',
        short: 'DPL',
        size: 6
    },
    iterations: {
        min: 100000,
        max: 1000000,
        maxDigits: 10
    }
};
