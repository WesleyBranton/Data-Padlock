/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

browser.browserAction.onClicked.addListener(function(){open("/popup/main.html")});
browser.webRequest.onBeforeRequest.addListener(getMessage,{urls: ["*://*.securesend.local/*","*://securesend.local/*"]},["blocking"]);
var isAndroid;
detectOS();

// Open window
function open(page) {
	if (!isAndroid) {
		browser.windows.create({
			type:"popup",
            height:900,
            width:550,
			url:page
		});
	} else {
		browser.tabs.create({
			url:page
		});
	}
}

// Load message URL
function getMessage(requestDetails) {
	var msg = requestDetails.url;
	msg = msg.slice(msg.indexOf('?m='));
	if (msg.length > 3) {
		open("/popup/read.html" + msg);
	}
	return {cancel: true};
}

// Detect user operating system
async function detectOS() {
	var userOS = await browser.runtime.getPlatformInfo();
	if (userOS.os == 'android') {
		isAndroid = true;
	} else {
		isAndroid = false;
	}
}
