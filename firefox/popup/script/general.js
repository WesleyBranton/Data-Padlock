/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Convert user password into a key
 * @async
 * @param {String} password
 * @returns {Object} key
 */
async function createKey(password) {
    return await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    );
}

/**
 * Generate key from password key
 * @async
 * @param {Object} key
 * @param {Object} algorithm 
 * @param {String} mode
 * @returns {Object} key
 */
async function generateKey(key, salt, iterations, mode) {
    return await crypto.subtle.deriveKey({
            name: 'PBKDF2',
            salt: salt,
            iterations: iterations,
            hash: 'SHA-512'
        },
        key,
        {
            name: config.mode,
            length: 256
        },
        true,
        [mode]
    );
}

/**
 * Create an error message banner
 * @param {String} text
 * @param {String} type
 */
function createError(text) {
    const banner = document.getElementById('banner');
    banner.textContent = text;
    banner.classList.add('show');

    setTimeout(() => { banner.classList.remove('show') }, 3000);
}

/**
 * Change screen visible
 * @param {Object} screen
 */
function setScreen(screen) {
    const screens = Object.values(UI.screen);
    screens.forEach(s => s.classList.add('hide'));
    screen.classList.remove('hide');
}

/**
 * Insert the donation message
 * (Has a random chance of appearing)
 */
function showDonationLink() {
    const random = Math.floor((Math.random() * 3) + 1);

    if (random == 1 || true) {
        document.getElementById('donationpopup').className = '';
        document.getElementById('donate').addEventListener('click', () => { window.open('https://www.paypal.me/wbrantonaddons', '_blank') });
    }
}

async function checkToS(mode) {
    const { tos } = await browser.storage.local.get();
    const tosVersion = 1;

    if (tos != tosVersion) {
        showLoading();
        window.location.href = './tos.html?r=' + mode;
    }
}
