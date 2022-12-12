/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Define UI elements
const UI = {
    field: {
        password: document.getElementById('password'),
        output: document.getElementById('unlocked-message')
    },
    file: {
        section: document.getElementById('file-section'),
        input: document.getElementById('file'),
        drop: document.getElementById('file-drop'),
        browse: document.getElementById('file-browse'),
        remove: document.getElementById('file-remove')
    },
    screen: {
        loading: document.getElementById('loading-screen'),
        input: document.getElementById('screen-input'),
        output: document.getElementById('screen-output')
    },
    button: {
        start: document.getElementById('copy'),
        menu: document.getElementById('return'),
        download: document.getElementById('share-download'),
        new: document.getElementById('read-new'),
        load: document.getElementById('load')
    }
};

// Set mode
const encryption = false;

// Register event listeners
UI.field.password.addEventListener('keyup', verify);
UI.button.load.addEventListener('click', decrypt);
UI.button.menu.addEventListener('click', () => { nav('main') });
UI.button.new.addEventListener('click', () => { nav('main') });
UI.button.download.addEventListener('click', () => { saveFile(downloadFile.data, downloadFile.name) });
UI.file.input.addEventListener('change', loadFile);
registerFileDrop();

// Run page load scripts
pageLoad();

/**
 * Handle page load
 */
async function pageLoad() {
    await checkToS('decrypt');
    clearFields(true);
    showDonationLink();
    setScreen(UI.screen.input);
}

/**
 * Start message decryption
 * @async
 */
async function decrypt() {
    // Start loading screen
    setScreen(UI.screen.loading);
    let meta;
    let data = fileContents;

    // Parse meta data
    const metaLengthDigits = parseInt(new TextDecoder().decode(data.slice(0, config.maxMetaLengthDigits)));
    const metaLength = parseInt(new TextDecoder().decode(data.slice(config.maxMetaLengthDigits, config.maxMetaLengthDigits + metaLengthDigits)));
    data = data.slice(config.maxMetaLengthDigits + metaLengthDigits);
    meta = data.slice(0 - metaLength);
    data = data.slice(0, data.byteLength - metaLength);

    // Parse key iterations
    const iterationsMeta = parseInt(new TextDecoder().decode(data.slice(0, config.iterations.maxDigits)));
    data = data.slice(config.iterations.maxDigits);

    // Setup decryption
    const key = await createKey(UI.field.password.value);
    const saltMeta = data.slice(config.ivSize, config.ivSize + config.saltSize);
    const algorithmMeta = {
        name: config.mode,
        iv: data.slice(0, config.ivSize)
    };
    data = data.slice(config.ivSize + config.saltSize);

    // Try decrypting meta
    try {
        const keyMeta = await generateKey(key, saltMeta, iterationsMeta, 'decrypt');
        meta = await crypto.subtle.decrypt(algorithmMeta, keyMeta, meta);
    } catch (error) {
        wrongPassword();
        return false;
    }

    // Parse meta
    meta = JSON.parse(new TextDecoder().decode(meta));

    // Get salt
    const saltFile = new Uint8Array(config.saltSize);
    saltFile.set(meta.salt.split(',').map(Number));

    // Get IV
    const ivFile = new Uint8Array(config.ivSize);
    ivFile.set(meta.iv.split(',').map(Number));

    // Setup decryption
    const algorithmFile = {
        name: config.mode,
        iv: ivFile
    };

    // Try decrypting file
    try {
        const keyFile = await generateKey(key, saltFile, meta.iterations, 'decrypt');
        data = await crypto.subtle.decrypt(algorithmFile, keyFile, data);
    } catch (error) {
        wrongPassword();
        return false;
    }

    fileContents = null;

    // Parse Time
    let time = new Date(parseInt(meta.time));
    time = time.toLocaleDateString() + ' @ ' + time.toLocaleTimeString();
    document.getElementById('encryption-time').textContent = time;

    // Refresh output screen
    UI.screen.output.classList.remove('file');
    UI.screen.output.classList.remove('message');

    if (meta.isFile) {
        // Handle file
        UI.screen.output.classList.add('file');
    } else {
        // Handle message
        data = new TextDecoder().decode(data);
        meta.fileName += '.txt';
        UI.field.output.value = data;
        UI.screen.output.classList.add('message');
    }

    // Create file
    const blob = new Blob([data], {
        type: 'application/octet-binary'
    });
    downloadFile = {
        name: meta.fileName,
        data: URL.createObjectURL(blob)
    };

    // Change to end screen
    setScreen(UI.screen.output);
    clearFields(false);
}

/**
 * Handle wrong password errors
 */
function wrongPassword() {
    UI.field.password.value = '';
    createError(browser.i18n.getMessage('errorWrongPassword'));
    setScreen(UI.screen.input);
}

/**
 * Clear all input fields
 * @param {boolean} all 
 */
function clearFields(all) {
    if (all) {
        UI.field.output.value = '';
        downloadFile = null;
        fileContents = null;
    }

    UI.field.password.value = '';
    unloadFile();
}

/**
 * Verify all required information is entered
 */
function verify() {
    UI.button.load.disabled = ((!fileLoaded) || UI.field.password.value.length <= 0);
}

/**
 * Checks if the file is valid
 * @param {string} file
 * @return {boolean} isValid
 */
function validFlag(flag) {
    if (flag.indexOf(config.flag.short) != 0) {
        createError(browser.i18n.getMessage('errorInvalidFile'));
        return false;
    }

    return true;
}

/**
 * Checks if the file type is valid
 * @return {boolean} isValid
 */
function validFileType() {
    const fileName = UI.file.input.files[0].name.toLowerCase();
    const fileNameLength = fileName.length;

    return (fileName.substring(fileNameLength - config.fileExtension.length, fileNameLength) == config.fileExtension);
}

/**
 * Checks if the version flag matches the current version
 * @param {string} flag 
 */
function checkVersion(flag) {
    const version = parseInt(flag.substring(config.flag.short.length, flag.length));

    if (version != config.version) {
        setScreen(UI.screen.loading);
        window.location.href = `./version.html?v=${version}`;
        return false;
    }

    return true;
}
