/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Define UI elements
const UI = {
    field: {
        input: document.getElementById('data'),
        password: document.getElementById('password'),
        passwordConfirm: document.getElementById('confirm-password')
    },
    file: {
        section: document.getElementById('file-section'),
        input: document.getElementById('file'),
        drop: document.getElementById('file-drop'),
        browse: document.getElementById('file-browse'),
        remove: document.getElementById('file-remove'),
        toggle: document.getElementById('file-mode')
    },
    screen: {
        loading: document.getElementById('loading-screen'),
        input: document.getElementById('screen-input'),
        output: document.getElementById('screen-output')
    },
    weakPassword: {
        bar: document.getElementById('password-bar'),
        confirm: document.getElementById('continue'),
        cancel: document.getElementById('cancel')
    },
    passwordStrength: {
        bar: document.getElementById('strengthbar'),
        container: document.getElementById('password-requirements'),
        size: document.getElementById('password-requirements-length'),
        lowercase: document.getElementById('password-requirements-lowercase'),
        uppercase: document.getElementById('password-requirements-uppercase'),
        number: document.getElementById('password-requirements-number'),
        symbol: document.getElementById('password-requirements-symbol')
    },
    button: {
        start: document.getElementById('copy'),
        menu: document.getElementById('return'),
        download: document.getElementById('share-download'),
        new: document.getElementById('share-new')
    },
    mainBar: document.getElementById('main-bar')
};

// Set mode
const encryption = true;

// Register event listeners
UI.field.input.addEventListener('keyup', verify);
UI.field.password.addEventListener('keyup', verify);
UI.field.password.addEventListener('keyup', () => { UI.field.passwordConfirm.value = '' });
UI.field.passwordConfirm.addEventListener('keyup', verify);
UI.field.password.addEventListener('focus', () => { togglePasswordRequirements(true) });
UI.field.password.addEventListener('blur', () => { togglePasswordRequirements(false) });
UI.button.start.addEventListener('click', () => { encrypt(false) });
UI.weakPassword.confirm.addEventListener('click', () => { encrypt(true) });
UI.button.menu.addEventListener('click', () => { nav('main') });
UI.weakPassword.cancel.addEventListener('click', () => { preventWeakPassword(false) });
UI.button.new.addEventListener('click', () => { nav('main') });
UI.button.download.addEventListener('click', () => { saveFile(downloadFile.data, downloadFile.name) });
registerFileDrop();

// Run page load scripts
pageLoad();

/**
 * Handle page load
 */
async function pageLoad() {
    await checkToS('encrypt');
    clearFields(true);
    showDonationLink();
    setScreen(UI.screen.input);
}

/**
 * Encrypt message
 * @param {boolean} bypassWeakPassword
 */
async function encrypt(bypassWeakPassword) {
    const password = UI.field.password.value;
    downloadFile = null;

    // Check if password is strong
    // or if the user has agreed to using weak password
    if (!bypassWeakPassword && getPasswordScore(password) < 5) return preventWeakPassword(true);

    const message = UI.field.input.value.trim();

    // Fail-safe if no data is ready
    if (!fileLoaded && message.length <= 0) return false;

    // Load message if there's no file
    if (!fileLoaded) fileContents = new TextEncoder().encode(message);

    // Start loading screen
    setScreen(UI.screen.loading);
    preventWeakPassword(false);

    // Setup encryption
    const flag = new TextEncoder().encode(config.flag.full);
    const saltMeta = await crypto.getRandomValues(new Uint8Array(config.saltSize));
    const saltFile = await crypto.getRandomValues(new Uint8Array(config.saltSize));
    const iterationsMeta = await getIterations();
    const iterationsFile = await getIterations();
    const algorithmMeta = {
        name: config.mode,
        iv: await crypto.getRandomValues(new Uint8Array(config.ivSize))
    };
    const algorithmFile = {
        name: config.mode,
        iv: await crypto.getRandomValues(new Uint8Array(config.ivSize))
    };

    // Generate meta data
    let meta = {
        isFile: fileLoaded,
        fileName: (fileLoaded) ? UI.file.input.files[0].name : 'message' + Date.now(),
        iv: algorithmFile.iv.join(),
        salt: saltFile.join(),
        iterations: iterationsFile,
        time: Date.now()
    }
    const fileName = meta.fileName + config.fileExtension;
    meta = new TextEncoder().encode(JSON.stringify(meta));

    // Create keys
    const key = await createKey(password);
    const keyMeta = await generateKey(key, saltMeta, iterationsMeta, 'encrypt');
    const keyFile = await generateKey(key, saltFile, iterationsFile, 'encrypt');

    // Encrypt data & meta
    const data = await crypto.subtle.encrypt(algorithmFile, keyFile, fileContents);
    meta = await crypto.subtle.encrypt(algorithmMeta, keyMeta, meta);
    fileContents = null;

    // Create meta markers
    const metaLength = meta.byteLength.toString();
    const metaLengthDigits = pad(metaLength.length, config.maxMetaLengthDigits);
    const iterations = pad(iterationsMeta.toString(), config.iterations.maxDigits);

    // Create file
    const blob = new Blob([flag, metaLengthDigits, metaLength, iterations, algorithmMeta.iv, saltMeta, data, meta], {
        type: 'application/octet-binary'
    });
    downloadFile = {
        name: fileName,
        data: URL.createObjectURL(blob)
    }

    // Change end screen type
    if (fileLoaded) {
        UI.screen.output.classList.add('file');
        UI.screen.output.classList.remove('message');
    } else {
        UI.screen.output.classList.remove('file');
        UI.screen.output.classList.add('message');
    }

    // Change to end screen
    setScreen(UI.screen.output);
    clearFields(true);
}

/**
 * Toggle the weak password warning UI
 */
function preventWeakPassword(show) {
    UI.field.password.disabled = show;
    UI.field.passwordConfirm.disabled = show;
    UI.field.input.disabled = show;

    if (show) {
        UI.mainBar.classList.add('hide');
        UI.weakPassword.bar.classList.remove('hide');
    } else {
        UI.mainBar.classList.remove('hide');
        UI.weakPassword.bar.classList.add('hide');
    }
}

/**
 * Clear all input fields
 * @param {boolean} all 
 */
function clearFields(all) {
    if (all) {
        UI.field.input.value = '';
        fileContents = null;
        unloadFile();
    }

    UI.field.password.value = '';
    UI.field.passwordConfirm.value = '';
}

/**
 * Verify all required information is entered
 */
function verify() {
    // Enable/Disable advance button
    UI.button.start.disabled = (
        (UI.field.input.value.length <= 0 && !fileLoaded) ||
        UI.field.password.value.length <= 0 ||
        UI.field.password.value != UI.field.passwordConfirm.value
    );

    // Update password strength bar
    const score = getPasswordScore(UI.field.password.value);
    if (score < 1) UI.passwordStrength.bar.className = 'none';
    else if (score < 4 && score >= 2) UI.passwordStrength.bar.className = 'bad';
    else if (score < 5 && score >= 4) UI.passwordStrength.bar.className = 'weak';
    else if (score < 6 && score >= 5) UI.passwordStrength.bar.className = 'fair';
    else UI.passwordStrength.bar.className = 'good';
}

/**
 * Calculate password strength
 * @param {string} password
 * @return {number} strength
 */
function getPasswordScore(password) {
    const pass = 'pass';
    const fail = 'fail';
    let score = 0;

    // Exists
    if (password.length > 0) {
        score++;
    }

    // More than 8 characters
    if (password.length > 8) {
        score++;
        UI.passwordStrength.size.className = pass;
    } else {
        UI.passwordStrength.size.className = fail;
    }

    // Includes lowercase letter
    if (/[a-z]/.test(password)) {
        score++;
        UI.passwordStrength.lowercase.className = pass;
    } else {
        UI.passwordStrength.lowercase.className = fail;
    }

    // Includes uppercase letter
    if (/[A-Z]/.test(password)) {
        score++;
        UI.passwordStrength.uppercase.className = pass;
    } else {
        UI.passwordStrength.uppercase.className = fail;
    }

    // Includes number
    if (/[0-9]/.test(password)) {
        score++;
        UI.passwordStrength.number.className = pass;
    } else {
        UI.passwordStrength.number.className = fail;
    }

    // Includes symbol
    if (/[!@#$%^&*(),.?]/.test(password)) {
        score++;
        UI.passwordStrength.symbol.className = pass;
    } else {
        UI.passwordStrength.symbol.className = fail;
    }

    return score;
}

/**
 * Toggle password requirements information
 * @param {boolean} show
 */
function togglePasswordRequirements(show) {
    if (show) {
        UI.passwordStrength.container.style.maxHeight = UI.passwordStrength.container.scrollHeight + 'px';
        UI.passwordStrength.container.style.marginBottom = '1em';
    } else {
        UI.passwordStrength.container.style.maxHeight = '0px';
        UI.passwordStrength.container.style.marginBottom = '0';
    }
}

/**
 * Checks if the file type is valid
 * @return {boolean} isValid
 */
function validFileType() {
    const fileName = UI.file.input.files[0].name.toLowerCase();
    const fileNameLength = fileName.length;

    return (fileName.substring(fileNameLength - config.fileExtension.length, fileNameLength) != config.fileExtension);
}

/**
 * Pad number
 * @param {number|string} number
 * @param {number} pad
 */
function pad(number, pad) {
    let padding = '';
    for (i = 0; i < pad; i++) padding += '0';
    return (padding + number).slice(-padding.length);
}

/**
 * General a random number of iterations
 */
async function getIterations() {
    let number = await crypto.getRandomValues(new Uint32Array(1))[0];

    // Put number within range
    while (number < config.iterations.min || number > config.iterations.max) {
        if (number < config.iterations.min) number += number;
        if (number > config.iterations.max) number = Math.round(number / 10);
    }

    return number;
}
