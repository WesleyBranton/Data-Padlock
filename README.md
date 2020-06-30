# Data Padlock [<img align="right" src=".github/fxaddon.png">](https://addons.mozilla.org/firefox/addon/data-padlock/)
Data Padlock is a browser-based encryption add-on that allows users to preserve their privacy and security by encrypting files and messages with a password. The add-on uses the Advanced Encryption Standard (the same standard used by the US government), which provides a high level of security.

This powerful add-on can be used for a variety of purposes, like sharing messages or files over an unencrypted network or securing files you store in the cloud.

The process is simple! Just add select the file or type the message that you want to encrypt, enter a strong password and Data Padlock will generate an encrypted file that can be shared or saved. To access the file or message later, just select the encrypted file and enter the password to unlock it. It's that easy!

The encryption is performed entirely using the browser's built-in cryptography libraries, so your information isn't sent over the internet and no one involved with the Data Padlock project can see what you're encrypting.

Maintain your privacy with Data Padlock!

## Development
This repository contains all of the required source code files to make changes to this extension. The "master" branch contains the source code for the latest stable release. If you want to test that version, you can view the release section to download the XPI file or visit the add-on listing on Mozilla.

If you want to make changes to this extension, you are welcome to do so. All files for the extension are located in the "firefox" folder. The source code of upcoming versions (if any) will be located in another branch.

To develop and test the extension, you need to open the "about:debugging" page in Firefox and select "Load Temporary Add-on". Then you can select any file within the "firefox" folder of this repository.

Further documentation about developing Firefox extensions can be found [here](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension).

## Release Notes
### Version 3.0.0
* **[NEW]** Files can now be encrypted/decrypted
* **[NEW]** Cryptography algorithm changed to AES-GCM
* **[NEW]** Added support for Firefox on Android
* **[NEW]** Added encryption timestamp
* **[NEW]** Users now required to agree to EULA and Privacy Policy
* **[CHANGED]** Cryptography output is now a file
* **[CHANGED]** Rebranded to **Data Padlock**
* **[CHANGED]** Cryptography performed using builtin API, not third-party library
* **[CHANGED]** Password salting now randomized
* **[CHANGED]** Expanded wiki information
* **[FIXED]** Improved version detection
* **[FIXED]** Improved wrong password handling
* **[FIXED]** Updated UI to more closely comply with the Web Content Accessibility Guidelines
* **[FIXED]** Disabling text field autocomplete (on mobile)
* **[FIXED]** Stopped Firefox from asking to save password
* **[FIXED]** Various performance optimizations
* **[REMOVED]** Removed link sharing

### Version 2.2
* **[NEW]** Added password confirmation field

### Version 2.1
* **[FIXED]** Restored compatibility on Firefox for Android

### Version 2.0
* **[NEW]** Updated encryption algorithm for better security
* **[NEW]** Can now share messages via links
* **[NEW]** *securesend.local* links will now launch the extension
* **[NEW]** Extension opens in popup window
* **[NEW]** Added ability to detect messages created with older version
* **[FIXED]** Extension can now tell when a password is incorrect
* **[CHANGED]** UI update