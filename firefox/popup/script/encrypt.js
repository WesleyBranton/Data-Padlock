/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Define UI elements
const messageInput = document.getElementById('secret');
const passwordInput = document.getElementById('code');
const passwordConfirmationInput = document.getElementById('confirm-code');

const shareURLOutput = document.getElementById('share-msg');
const shareURLCopyButton = document.getElementById('share-button');
const startNewMessageButton = document.getElementById('share-new');

const encryptButton = document.getElementById('copy');
const menuButton = document.getElementById('return');
const weakPasswordConfirmButton = document.getElementById('continue');
const weakPasswordCancelButton = document.getElementById('cancel');

const mainBar = document.getElementById('main-bar');
const passwordWarningBar = document.getElementById('password-bar');

const loadingScreen = document.getElementById('loading-screen');
const shareScreen = document.getElementById('user-share');
const inputScreen = document.getElementById('user-input');

const passwordStrengthBar = document.getElementById('strengthbar');
const passwordRequirementsContainer = document.getElementById('password-requirements');
const passwordRequirementsLength = document.getElementById('password-requirements-length');
const passwordRequirementsLowercase = document.getElementById('password-requirements-lowercase');
const passwordRequirementsUppercase = document.getElementById('password-requirements-uppercase');
const passwordRequirementsNumber = document.getElementById('password-requirements-number');
const passwordRequirementsSymbol = document.getElementById('password-requirements-symbol');

// Register event listeners
messageInput.addEventListener('keyup', verify);
passwordInput.addEventListener('keyup', verify);
passwordInput.addEventListener('keyup', function () {
    passwordConfirmationInput.value = ''
});
passwordConfirmationInput.addEventListener('keyup', verify);
passwordInput.addEventListener('focus', function () {
    togglePasswordRequirements(true)
});
passwordInput.addEventListener('blur', function () {
    togglePasswordRequirements(false)
});
shareURLOutput.addEventListener('focus', clipboard);
shareURLOutput.addEventListener('click', clipboard);
shareURLCopyButton.addEventListener('click', clipboard);
encryptButton.addEventListener('click', function () {
    encryptMsg(false)
});
weakPasswordConfirmButton.addEventListener('click', function () {
    encryptMsg(true)
});
menuButton.addEventListener('click', function () {
    nav('main')
});
weakPasswordCancelButton.addEventListener('click', cancel);
startNewMessageButton.addEventListener('click', startNew);

// Run page load scripts
verify();
pageLoad();

/**
 * Copy share URL to clipboard
 */
function clipboard() {
    shareURLOutput.select();
    document.execCommand('copy');
}

/**
 * Start message encryption
 * @param {boolean} bypassWeakPassword
 */
function encryptMsg(bypassWeakPassword) {
    let message = messageInput.value + 'secsend';
    let password = passwordInput.value;

    if (getPasswordScore(password) < 5 && !bypassWeakPassword) {
        passwordInput.disabled = true;
        messageInput.disabled = true;
        mainBar.className = 'bar hide';
        passwordWarningBar.className = '';
    } else {
        showLoading();
        cancel();
        start(message, password, 1);
    }
}

/**
 * Abort due to weak password
 */
function cancel() {
    passwordInput.disabled = false;
    messageInput.disabled = false;
    passwordWarningBar.className = 'hide';
    mainBar.className = 'bar';
}

/**
 * Encrypt message
 * @param {string} message
 * @param {string} key
 */
function encrypt(message, key) {
    let iv, msgBytes, aesCbc, encryptedBytes, encryptedHex;

    iv = generateIV(16);

    while (message.length % 16) {
        message += ' ';
    }

    msgBytes = aesjs.utils.utf8.toBytes(message);
    aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    encryptedBytes = aesCbc.encrypt(msgBytes);
    encryptedHex = aesjs.utils.hex.fromBytes(iv) + aesjs.utils.hex.fromBytes(encryptedBytes);

    saveMsg(encryptedHex.toUpperCase());
}

/**
 * Output encrypted message URL
 * @param {string} message
 */
function saveMsg(message) {
    message = 'http://securesend.local?m=' + message + 'VER2';
    shareURLOutput.value = message;
    loadingScreen.className = 'hide';
    shareScreen.className = '';
    messageInput.value = '';
    passwordInput.value = '';
    verify();
}

/**
 * Verify all required information is entered
 */
function verify() {
    let score;

    if (messageInput.value.length > 0 && passwordInput.value.length > 0 && passwordInput.value == passwordConfirmationInput.value) {
        encryptButton.disabled = false;
    } else {
        encryptButton.disabled = true;
    }

    score = getPasswordScore(passwordInput.value);
    if (score < 1) {
        passwordStrengthBar.className = 'none';
    } else if (score < 4 && score >= 2) {
        passwordStrengthBar.className = 'bad';
    } else if (score < 5 && score >= 4) {
        passwordStrengthBar.className = 'weak';
    } else if (score < 6 && score >= 5) {
        passwordStrengthBar.className = 'fair';
    } else if (score >= 6) {
        passwordStrengthBar.className = 'good';
    }
}

/**
 * Calculate password strength
 * @param {string} password
 * @return {number} strength
 */
function getPasswordScore(password) {
    let score = 0;
    let pass = 'pass';
    let fail = 'fail';

    // Exists
    if (password.length > 0) {
        score++;
    }

    // More than 8 characters
    if (password.length > 8) {
        score++;
        passwordRequirementsLength.className = pass;
    } else {
        passwordRequirementsLength.className = fail;
    }

    // Includes lowercase letter
    if (/[a-z]/.test(password)) {
        score++;
        passwordRequirementsLowercase.className = pass;
    } else {
        passwordRequirementsLowercase.className = fail;
    }

    // Includes uppercase letter
    if (/[A-Z]/.test(password)) {
        score++;
        passwordRequirementsUppercase.className = pass;
    } else {
        passwordRequirementsUppercase.className = fail;
    }

    // Includes number
    if (/[0-9]/.test(password)) {
        score++;
        passwordRequirementsNumber.className = pass;
    } else {
        passwordRequirementsNumber.className = fail;
    }

    // Includes symbol
    if (/[!@#$%^&*(),.?]/.test(password)) {
        score++;
        passwordRequirementsSymbol.className = pass;
    } else {
        passwordRequirementsSymbol.className = fail;
    }

    return score;
}

/**
 * Toggle password requirements information
 * @param {boolean} show
 */
function togglePasswordRequirements(show) {
    if (show) {
        passwordRequirementsContainer.style.maxHeight = passwordRequirementsContainer.scrollHeight + 'px';
        passwordRequirementsContainer.style.marginBottom = '1em';
    } else {
        passwordRequirementsContainer.style.maxHeight = '0px';
        passwordRequirementsContainer.style.marginBottom = '0';
    }
}

/**
 * Start a new message
 */
function startNew() {
    shareScreen.className = 'hide';
    inputScreen.className = '';
    shareURLOutput.value = '';
    location.reload();
}

/**
 * Handle page load
 * @async
 */
async function pageLoad() {
    let data = await browser.storage.local.get();
    let random = Math.floor((Math.random() * 3) + 1);

    pkeyload(data);

    if (random == 1) {
        document.getElementById('donationpopup').className = '';
        document.getElementById('donate').addEventListener('click', function () {
            window.open('https://www.paypal.me/wbrantonaddons', '_blank')
        });
    }

    loadingScreen.className = 'hide';
    shareScreen.className = 'hide';
    inputScreen.className = '';
}

/**
 * Insert P-Key Password Generator ad
 * @param {Object} storageData
 */
function pkeyload(storageData) {
    if (!storageData.hidepk) {
        document.getElementById('pkeyclose').addEventListener('click', pkeyclose);
        document.getElementById('pkeyclick').addEventListener('click', function () {
            window.open('https://addons.mozilla.org/firefox/addon/password-generator/', '_blank')
        });
        document.getElementById('pkeyad').className = '';
    }
}

/**
 * Permanently close P-Key Password Generator ad
 */
function pkeyclose() {
    browser.storage.local.set({
        hidepk: true
    });
    document.getElementById('pkeyad').className = 'hide';
}
