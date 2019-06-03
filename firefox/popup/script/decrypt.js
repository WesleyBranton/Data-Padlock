verify();
document.getElementById('secret').addEventListener('keyup',verify);
document.getElementById('code').addEventListener('keyup',verify);
load();

function load() {
	var loadMsg = getParameterByName('m');
	if (loadMsg != null && loadMsg.length > 16) {
		document.getElementById('secret').value = loadMsg;
		document.getElementById('message-box-container').className = 'loaded';
	} else {
		document.getElementById('secret').value = '';
		document.getElementById('message-box-container').className = 'unloaded';
	}
	document.getElementById('loading-screen').className = 'hide';
	document.getElementById('user-input').className = '';
}

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function decryptMsg() {
	showLoading();
	var message = document.getElementById("secret");
	var password = document.getElementById("code");
	start(message.value, password.value, 0);
}

function decrypt(message,key) {
	var message = message.toLowerCase();
	var iv = aesjs.utils.hex.toBytes(message.substr(0,16*2));
	var encryptedBytes = aesjs.utils.hex.toBytes(message.substr(16*2));
	var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
	var decryptedBytes = aesCbc.decrypt(encryptedBytes);
	var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
	saveMsg(decryptedText.trim());
}

function saveMsg(msg) {
	var read = document.getElementById("unlocked-message");
	read.value = msg;
		document.getElementById('loading-screen').className = 'hide';
	document.getElementById('user-share').className = '';
	var message = document.getElementById("secret");
	var password = document.getElementById("code");
	message.value = '';
	password.value = '';
	verify();
}

function reset() {
	document.getElementById('user-share').className = 'hide';
	document.getElementById('user-input').className = '';
	document.getElementById('unlocked-message').value = '';
}

function verify() {
	if (document.getElementById('secret').value.length > 0 && document.getElementById('code').value.length > 0) {
		document.getElementById('load').disabled = false;
	} else {
		document.getElementById('load').disabled = true;
	}
}

function menu() {
	showLoading();
	window.location.href = '/';
}

function another() {
	showLoading();
	window.location.href = '/read';
}

function showLoading() {
	document.getElementById('user-share').className = 'hide';
	document.getElementById('user-input').className = 'hide';
	document.getElementById('loading-screen').className = '';
}