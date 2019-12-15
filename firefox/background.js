/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Create variables
let isAndroid;

// Register event listeners
browser.browserAction.onClicked.addListener(function () {
    open("/popup/main.html")
});
browser.webRequest.onBeforeRequest.addListener(getMessage, {
    urls: [
        "*://*.securesend.local/*",
        "*://securesend.local/*"
    ]
}, ["blocking"]);

// Run extension load scripts
detectOS();

/**
 * Open a new window
 * @param {sting} page
 */
function open(page) {
    if (!isAndroid) {
        browser.windows.create({
            type: "popup",
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
 * Parse message data from URL
 * @param {object} requestDetails
 * @return {object} cancel
 */
function getMessage(requestDetails) {
    let message = requestDetails.url;
    message = message.slice(message.indexOf('?m='));

    if (message.length > 3) {
        open("/popup/read.html" + message);
    }
    return {
        cancel: true
    };
}

/**
 * Detect user operating system
 */
async function detectOS() {
    let userOS = await browser.runtime.getPlatformInfo();

    if (userOS.os == 'android') {
        isAndroid = true;
    } else {
        isAndroid = false;
    }
}
