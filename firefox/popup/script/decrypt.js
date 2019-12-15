/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Define UI elements
const messageInput = document.getElementById('secret');
const passwordInput = document.getElementById('code');

const startNewMessageButton = document.getElementById('share-new');
const menuButton = document.getElementById('return');

const loadingScreen = document.getElementById('loading-screen');
const viewScreen = document.getElementById('user-share');
const inputScreen = document.getElementById('user-input');
const successScreen = document.getElementById('unlocked-message');

const messageInputContainer = document.getElementById('message-box-container');
const wrongPasswordMessage = document.getElementById('wrongpassword');

// Register event listeners
messageInput.addEventListener('keyup', verify);
passwordInput.addEventListener('keyup', verify);
document.getElementById('load').addEventListener('click', decryptMsg);
menuButton.addEventListener('click', function () {
    nav('main')
});
startNewMessageButton.addEventListener('click', function () {
    nav('main')
});
document.getElementById('read-new').addEventListener('click', function () {
    nav('read')
});

// Run page load scripts
verify();
pageLoad();

/**
 * Handle page load
 */
function pageLoad() {
    let message = getParameterByName('m');

    if (message != null && message.length > 16) {
        messageInput.value = message;
        messageInputContainer.className = 'loaded';
    } else {
        messageInput.value = '';
        messageInputContainer.className = 'unloaded';
    }

    loadingScreen.className = 'hide';
    inputScreen.className = '';
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

/**
 * Start message decryption
 */
function decryptMsg() {
    showLoading();
    start(messageInput.value, passwordInput.value, 0);
}

/**
 * Decrypt message
 * @param {string} message
 * @param {string} key
 */
function decrypt(message, key) {
    let msg, version,
        iv, encryptedBytes, aesCbc, decryptedBytes, decryptedText;

    msg = message.toLowerCase();
    msg = msg.trim();
    version = msg.slice(msg.indexOf('ver') + 3);
    msg = msg.slice(0, msg.indexOf('ver'));

    if (version != '2' || message.indexOf('VER') < 0) {
        if (message.indexOf('VER') < 0) {
            version = '1'
        }
        wrongVersion(version);
    } else {
        iv = aesjs.utils.hex.toBytes(msg.substr(0, 16 * 2));
        encryptedBytes = aesjs.utils.hex.toBytes(msg.substr(16 * 2));
        aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
        decryptedBytes = aesCbc.decrypt(encryptedBytes);
        decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        saveMsg(decryptedText.trim());
    }
}

/**
 * Display message
 * @param {string} message
 */
function saveMsg(message) {
    if (message.slice(message.length - 7) == 'secsend') {
        message = message.slice(0, message.length - 7);
        successScreen.value = message;
        viewScreen.className = '';
        messageInput.value = '';
        wrongPasswordMessage.style.display = 'none';
    } else {
        wrongPasswordMessage.style.display = 'block';
        inputScreen.className = '';
    }

    passwordInput.value = '';
    verify();
    loadingScreen.className = 'hide';
}

/**
 * Show version mismatch error message
 * @param {number|string} version
 */
function wrongVersion(version) {
    showLoading();
    window.location.href = './version.html?v=' + version;
}

/**
 * Verify all required information is entered
 */
function verify() {
    if (messageInput.value.length > 0 && passwordInput.value.length > 0) {
        document.getElementById('load').disabled = false;
    } else {
        document.getElementById('load').disabled = true;
    }
}
