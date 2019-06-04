/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

browser.browserAction.onClicked.addListener(function(){open("/popup/main.html")});
browser.webRequest.onBeforeRequest.addListener(getMessage,{urls: ["*://*.securesend.local/*","*://securesend.local/*"]},["blocking"]);

// Open window
function open(page) {
	browser.windows.create({
		type:"popup",
		url:page
	});
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
