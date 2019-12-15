/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

document.getElementById('view').addEventListener('click', function () {
    window.open('https://addons.mozilla.org/firefox/addon/secure-send/versions/', '_blank')
});
document.getElementById('moreinfo').addEventListener('click', function () {
    window.open('https://github.com/WesleyBranton/Secure-Send/wiki/How-to-read-messages-created-in-a-different-version', '_blank')
});
document.getElementById('cancel').addEventListener('click', function () {
    nav('main')
});
pageLoad();

/**
 * Handle page load
 */
function pageLoad() {
    var version = getParameterByName('v');
    document.getElementById('versionnumber').textContent = version;
    document.getElementById('loading-screen').className = 'hide';
    document.getElementById('user-input').className = '';
}

/**
 * Get URL paramter
 * @param {string} parameter
 * @param {string} url
 * @return {string} value
 */
function getParameterByName(parameter, url) {
    let regex, results;

    if (!url) {
        url = window.location.href;
    }

    parameter = parameter.replace(/[\[\]]/g, "\\$&");
    regex = new RegExp("[?&]" + parameter + "(=([^&#]*)|&|#|$)");
    results = regex.exec(url);

    if (!results) {
        return null;
    } else if (!results[2]) {
        return '';
    };

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
