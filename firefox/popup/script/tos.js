/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const UI = {
    checkbox: {
        eula: document.getElementById('eula-checkbox'),
        pp: document.getElementById('pp-checkbox')
    },
    button: {
        agree: document.getElementById('agree'),
        cancel: document.getElementById('cancel'),
        menu: document.getElementById('menu')
    },
    screen: {
        loading: document.getElementById('loading-screen'),
        input: document.getElementById('screen-input'),
        output: document.getElementById('screen-output')
    }
};

// Register event listeners
UI.checkbox.eula.addEventListener('change', check);
UI.checkbox.pp.addEventListener('change', check);
UI.button.agree.addEventListener('click', agree);
UI.button.cancel.addEventListener('click', cancel);
UI.button.menu.addEventListener('click', () => { nav('main') });

const version = 1;
setScreen(UI.screen.input);

/**
 * Agree to terms
 */
async function agree() {
    if (check()) {
        await browser.storage.local.set({ tos: version });
        const mode = await getParameterByName('r');
        if (mode.length > 1) return nav(mode);
        nav('main');
    }
}

/**
 * Disagree to terms
 */
function cancel() {
    setScreen(UI.screen.output);
}

/**
 * Check if checkboxes are selected
 */
function check() {
    const isValid = (UI.checkbox.eula.checked && UI.checkbox.pp.checked);
    UI.button.agree.disabled = !isValid;
    return isValid;
}

/**
 * Get URL paramter
 * @param {string} parameter
 * @param {string} url
 * @return {string} value
 */
function getParameterByName(parameter) {
    const url = window.location.href;
    let regex, results;

    parameter = parameter.replace(/[\[\]]/g, '\\$&');
    regex = new RegExp('[?&]' + parameter + '(=([^&#]*)|&|#|$)');
    results = regex.exec(url);

    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
