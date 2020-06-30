/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

document.getElementById('lock').addEventListener('click', () => { nav('encrypt') });
document.getElementById('unlock').addEventListener('click', () => { nav('decrypt') });
document.getElementById('wiki').addEventListener('click', () => { window.open('https://github.com/WesleyBranton/Data-Padlock/wiki', '_blank') });
document.getElementById('release').addEventListener('click', () => { window.open('https://github.com/WesleyBranton/Data-Padlock/releases/tag/v' + browser.runtime.getManifest().version, '_blank') });
document.getElementById('terms').addEventListener('click', () => { window.open('https://addons.mozilla.org/firefox/addon/data-padlock/eula/', '_blank') });
document.getElementById('privacy').addEventListener('click', () => { window.open('https://addons.mozilla.org/firefox/addon/data-padlock/privacy/', '_blank') });
