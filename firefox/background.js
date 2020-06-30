/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Create variables
let isAndroid;

// Register event listeners
browser.browserAction.onClicked.addListener(() => { open('/popup/main.html') });
browser.runtime.onMessage.addListener(messageHandler);
browser.runtime.onInstalled.addListener(installHandler);

// Run extension load scripts
detectOS();

/**
 * Open a new window
 * @param {sting} page
 */
function open(page) {
    if (!isAndroid) {
        browser.windows.create({
            type: 'popup',
            height: 900,
            width: 550,
            url: page
        });
    } else {
        browser.tabs.create({
            url: page
        });
    }
}

/**
 * Detect user operating system
 */
async function detectOS() {
    const { os } = await browser.runtime.getPlatformInfo();
    isAndroid = (os == 'android');
}

/**
 * Opens file save as dialog
 * @async
 * @param {string} file
 * @param {number} time
 * @param {boolean} incognito
 */
async function saveFile(file, fileName, incognito) {
    await browser.downloads.download({
        url: file,
        filename: fileName,
        conflictAction: 'uniquify',
        saveAs: true,
        incognito: incognito
    });
}

/**
 * Handles incoming messages
 * @param {Object} message
 * @param {Object} sender
 */
function messageHandler(message, sender) {
    switch (message.type) {
        case 'save':
            saveFile(message.file, message.fileName, sender.tab.incognito);
    }
}

function installHandler(details) {
    if (details.reason == 'install') {
        browser.tabs.create({ url: 'https://wesleybranton.github.io/Data-Padlock/welcome?v=3.0' });
    } else if (details.reason == 'update') {
        if (parseFloat(details.previousVersion) < 3) {
            browser.tabs.create({ url: 'https://wesleybranton.github.io/Data-Padlock/v3/rebrand' });
        }
    }
}
