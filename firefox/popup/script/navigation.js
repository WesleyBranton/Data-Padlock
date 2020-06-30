/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Load a page
 * @param {string} page
 */
function nav(page) {
    showLoading();
    window.location.href = `./${page}.html`;
}

/**
 * Show loading bar
 */
function showLoading() {
    if (document.getElementById('screen-input')) document.getElementById('screen-input').className = 'hide';
    if (document.getElementById('screen-output')) document.getElementById('screen-output').className = 'hide';
    if (document.getElementById('menu-buttons')) document.getElementById('menu-buttons').className = 'hide';
    document.getElementById('loading-screen').className = '';
}
