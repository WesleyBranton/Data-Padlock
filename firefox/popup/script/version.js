/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

document.getElementById('view').addEventListener('click', () => { window.open('https://addons.mozilla.org/firefox/addon/data-padlock/versions/', '_blank') });
document.getElementById('cancel').addEventListener('click', () => { nav('main') });
pageLoad();

/**
 * Handle page load
 */
function pageLoad() {
    const version = getParameterByName('v');

    if (!isNaN(version) && version != null) document.getElementById('versionnumber').textContent = 'Version ' + version;
    else document.getElementById('versionnumber').textContent = 'a different version';
    document.getElementById('loading-screen').className = 'hide';
    document.getElementById('user-input').className = '';
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
