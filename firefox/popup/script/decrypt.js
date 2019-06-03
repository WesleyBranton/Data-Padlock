verify();
document.getElementById('secret').addEventListener('keyup',verify);
document.getElementById('code').addEventListener('keyup',verify);
document.getElementById('load').addEventListener('click',decryptMsg);
document.getElementById('return').addEventListener('click',function(){nav('main')});
document.getElementById('share-new').addEventListener('click',function(){nav('main')});
document.getElementById('read-new').addEventListener('click',function(){nav('read')});
load();

// Page loaded
function load() {
	// Try to load message from URL parameters
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


// Check URL parameters
function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Start message decryption
function decryptMsg() {
	showLoading();
	var message = document.getElementById("secret");
	var password = document.getElementById("code");
	start(message.value, password.value, 0);
}

// Decrypt message
function decrypt(message,key) {
	var msg = message.toLowerCase();
	msg = msg.trim();
	var version = msg.slice(msg.indexOf('ver') + 3);
	msg = msg.slice(0,msg.indexOf('ver'));
	if (version != '2' || message.indexOf('VER') < 0) {
		if (message.indexOf('VER') < 0) {
			version = '1'
		}
		wrongVersion(version);
	} else {
		var iv = aesjs.utils.hex.toBytes(msg.substr(0,16*2));
		var encryptedBytes = aesjs.utils.hex.toBytes(msg.substr(16*2));
		var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
		var decryptedBytes = aesCbc.decrypt(encryptedBytes);
		var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
		saveMsg(decryptedText.trim());
	}
}

// Display the decrypted message
function saveMsg(msg) {
	var wrongPassword = document.getElementById('wrongpassword');
	if (msg.slice(msg.length - 7) == 'secsend') {
		msg = msg.slice(0, msg.length - 7);
		var read = document.getElementById("unlocked-message");
		read.value = msg;
		document.getElementById('user-share').className = '';
		var message = document.getElementById("secret");
		message.value = '';
		wrongPassword.style.display = 'none';
	} else {
		wrongPassword.style.display = 'block';
		document.getElementById('user-input').className = '';
	}
	var password = document.getElementById("code");
	password.value = '';
	verify();
	document.getElementById('loading-screen').className = 'hide';
}

// Wrong version error message
function wrongVersion(version) {
	showLoading();
	window.location.href = './version.html?v=' + version;
}

// Reset fields
function reset() {
	document.getElementById('user-share').className = 'hide';
	document.getElementById('user-input').className = '';
	document.getElementById('unlocked-message').value = '';
}

// Verify user information
function verify() {
	// Check that password and message fields are entered
	if (document.getElementById('secret').value.length > 0 && document.getElementById('code').value.length > 0) {
		document.getElementById('load').disabled = false;
	} else {
		document.getElementById('load').disabled = true;
	}
}