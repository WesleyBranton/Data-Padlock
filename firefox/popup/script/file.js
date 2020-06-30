/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Register event handlers for a file drop zone
 */
function registerFileDrop() {
    UI.file.input.addEventListener('change', loadFile);
    UI.file.remove.addEventListener('click', unloadFile);

    UI.file.drop.addEventListener('dragenter', fileOn, false);
    UI.file.drop.addEventListener('dragover', fileOn, false);
    UI.file.drop.addEventListener('dragstart', fileOn, false);

    UI.file.drop.addEventListener('dragleave', fileOff, false);

    UI.file.drop.addEventListener('drop', fileDropped, false);

    UI.file.browse.addEventListener('click', () => { UI.file.input.click() });

    if (UI.file.toggle) UI.file.toggle.addEventListener('click', changeInputMode);

    window.addEventListener('dragover', (e) => { e.preventDefault() }, false);
    window.addEventListener('drop', (e) => { e.preventDefault() }, false);
}

/**
 * Handle file dropped into the drop zone
 * @param {Object} event
 */
function fileDropped(event) {
    event.preventDefault();
    UI.file.drop.classList.remove('highlight');

    if (event.dataTransfer.items && UI.file.input.value == '') {
        if (event.dataTransfer.items.length > 1) {
            createError('Can only use 1 file at a time');
        } else {
            if (event.dataTransfer.items[0].kind == 'file') {
                UI.file.input.files = event.dataTransfer.files;
                loadFile();
            }
        }
    }
}

/**
 * Handle when file is over the drop zone
 * @param {Object} event
 */
function fileOn(event) {
    event.preventDefault();
    UI.file.drop.classList.add('highlight');
}

/**
 * Handle when file is off the drop zone
 * @param {Object} event
 */
function fileOff(event) {
    event.preventDefault();
    UI.file.drop.classList.remove('highlight');
}

/**
 * Change the state of the file drop zone
 * @param {string} state
 */
function changeFileDropState(state) {
    const states = [
        'highlight',
        'empty',
        'found',
        'loading'
    ];

    states.forEach(s => UI.file.drop.classList.remove(s));
    UI.file.drop.classList.add(state);
}

/**
 * Toggle between text and file input mode
 */
function changeInputMode() {
    if (UI.field.password.disabled) return false;

    if (UI.file.section.classList.contains('mode-file')) {
        UI.file.section.classList.remove('mode-file');
        UI.file.section.classList.add('mode-text');
    } else {
        UI.file.section.classList.add('mode-file');
        UI.file.section.classList.remove('mode-text');
    }

    unloadFile();
}

/**
 * Remove file from page
 */
function unloadFile() {
    fileLoaded = false;
    fileContents = null;

    document.getElementById('file-name').textContent = '';
    UI.file.input.value = '';
    if (UI.field.message) UI.field.message.value = '';

    changeFileDropState('empty');
    verify();
}

/**
 * Load user file
 */
async function loadFile() {
    changeFileDropState('loading');

    // Check if the file type is valid
    if (!validFileType()) {
        if (encryption) createError('This file has already been encrypted!');
        else createError('File must be a .DPL file!');
        return unloadFile();
    }

    // Load file variable
    const file = UI.file.input.files[0];
    const reader = new FileReader();

    // Enforce file size limit of 100MB (for encryption only)
    if (encryption && file.size > 100000000) {
        createError('File cannot be larger than 100MB!');
        return unloadFile();
    }

    // Handle file after it's loaded
    reader.onload = (e) => {
        // Save file contents
        fileContents = e.target.result;

        // Extra validation (for decryption only)
        if (!encryption) {
            const flag = new TextDecoder().decode(fileContents.slice(0, config.flag.size));

            // Remove flag if the file is a valid DPL
            if (validFlag(flag)) fileContents = fileContents.slice(config.flag.size);

            // Fail on version mismatch
            if (!checkVersion(flag)) return unloadFile();
        }

        // Set UI state
        document.getElementById('file-name').textContent = UI.file.input.files[0].name;
        fileLoaded = true;
        changeFileDropState('found');
        verify();
    }

    // Start Reading File
    reader.readAsArrayBuffer(file);
}

/**
 * Triggers file saving
 * @param {string} fileURL
 * @param {string} fileName
 */
function saveFile(fileURL, fileName) {
    browser.runtime.sendMessage({
        type: 'save',
        file: fileURL,
        fileName: fileName
    });
}

// Variables
let fileLoaded = false;
let fileContents;
let downloadFile;
