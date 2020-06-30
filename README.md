# Data Padlock [<img align="right" src=".github/fxaddon.png">](https://addons.mozilla.org/firefox/addon/data-padlock/)
Any personal information sent over the internet is vulnerable to security threats like wiretapping. Thankfully, encryption exists to help protect data transmitted over the internet. Encryption is a process used to convert plain text into data that cannot be understood by anyone else but the intended receiver.

Data Padlock uses the Advanced Encryption Standard (AES) to locally encrypt your files or messages until the receiver enters the configured password. AES encryption provides a high level of security, so much so that it is used by the US government!

Data Padlock is simple to use. Simply attach your file or enter your text into the add-on, assign a password and the encrypted file will be saved so you can use it on your instant messaging service or email client. When the receiver gets the file, they simply attach the file to the Data Padlock add-on and enter the password.

Keep your private files and messages private with Data Padlock!

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