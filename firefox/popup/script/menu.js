/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

var button = document.getElementsByTagName('button');
for (i = 0; i < button.length; i++) {
	button[i].addEventListener('click',openPage);
}

function openPage(e) {
	var page = e.target.id;
	window.location = page + '.html';
}