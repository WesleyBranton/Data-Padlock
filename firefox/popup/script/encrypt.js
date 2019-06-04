verify();
document.getElementById('secret').addEventListener('keyup',verify);
document.getElementById('code').addEventListener('keyup',verify);
document.getElementById('code').addEventListener('focus',showpass);
document.getElementById('code').addEventListener('blur',hidepass);
document.getElementById('share-msg').addEventListener('focus',clipboard);
document.getElementById('share-msg').addEventListener('click',clipboard);
document.getElementById('share-button').addEventListener('click',clipboard);
document.getElementById('copy').addEventListener('click',function(){encryptMsg(false)});
document.getElementById('continue').addEventListener('click',function(){encryptMsg(true)});
document.getElementById('return').addEventListener('click',function(){nav('main')});
document.getElementById('cancel').addEventListener('click',cancel);
document.getElementById('share-new').addEventListener('click',reset);
load();

// Save encrypted message to clipboard
function clipboard() {
	document.getElementById('share-msg').select();
	document.execCommand('copy');
}

// Start message encryption
function encryptMsg(bypass) {
	// Check if password is weak & that user has not confirmed the use of a weak password
	if (getPasswordScore() < 5 && !bypass) {
		document.getElementById('code').disabled = true;
		document.getElementById('secret').disabled = true;
		document.getElementById('main-bar').className = 'bar hide';
		document.getElementById('password-bar').className = '';
	} else {
		showLoading();
		var message = document.getElementById("secret").value;
		message += 'secsend';
		var password = document.getElementById("code").value;
		cancel();
		start(message, password, 1);
	}
}

// Cancel weak password
function cancel() {
	document.getElementById('code').disabled = false;
	document.getElementById('secret').disabled = false;
	document.getElementById('password-bar').className = 'hide';
	document.getElementById('main-bar').className = 'bar';
}

// Encrypt password
function encrypt(msg,key) {
	var iv = generateIV(16);
	while (msg.length % 16) {
		msg += ' ';
	}
	var msgBytes = aesjs.utils.utf8.toBytes(msg);
	var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
	var encryptedBytes = aesCbc.encrypt(msgBytes);
	var encryptedHex = aesjs.utils.hex.fromBytes(iv) + aesjs.utils.hex.fromBytes(encryptedBytes);
	saveMsg(encryptedHex.toUpperCase());
}

// Output the encrypted password
function saveMsg(msg) {
	msg = 'http://securesend.local?m=' + msg + 'VER2';
	var share = document.getElementById("share-msg");
	share.value = msg;
	document.getElementById('loading-screen').className = 'hide';
	document.getElementById('user-share').className = '';
	var message = document.getElementById("secret");
	var password = document.getElementById("code");
	message.value = '';
	password.value = '';
	verify();
}

// Verify user information
function verify() {
	// Check that password and message have been filled
	if (document.getElementById('secret').value.length > 0 && document.getElementById('code').value.length > 0) {
		document.getElementById('copy').disabled = false;
	} else {
		document.getElementById('copy').disabled = true;
	}
	
	// Adjust the password strength information
	var strength = document.getElementById('strengthbar');
	var score = getPasswordScore();
	if (score < 1) {
		strength.className = 'none';
	} else if (score < 4 && score >= 2) {
		strength.className = 'bad';
	} else if (score < 5 && score >= 4) {
		strength.className = 'weak';
	} else if (score < 6 && score >= 5) {
		strength.className = 'fair';
	} else if (score >= 6) {
		strength.className = 'good';
	}
}

// Check password strength
function getPasswordScore() {
	var password = document.getElementById('code').value;
	var score = 0;
	
	// There is a password entered
	if (password.length > 0) {
		score++;
	}
	
	// Password longer than 8 characters
	if (password.length > 8) {
		score++;
		document.getElementById('password-requirements-length').className = 'pass';
	} else {
		document.getElementById('password-requirements-length').className = 'fail';
	}
	
	// There is a lowercase letter
	if (/[a-z]/.test(password)) {
		score++;
		document.getElementById('password-requirements-lowercase').className = 'pass';
	} else {
		document.getElementById('password-requirements-lowercase').className = 'fail';
	}
	
	// There is an uppercase letter
	if (/[A-Z]/.test(password)) {
		score++;
		document.getElementById('password-requirements-uppercase').className = 'pass';
	} else {
		document.getElementById('password-requirements-uppercase').className = 'fail';
	}
	
	// There is a number
	if (/[0-9]/.test(password)) {
		score++;
		document.getElementById('password-requirements-number').className = 'pass';
	} else {
		document.getElementById('password-requirements-number').className = 'fail';
	}
	
	// There is a symbol
	if (/[!@#$%^&*(),.?]/.test(password)) {
		score++;
		document.getElementById('password-requirements-symbol').className = 'pass';
	} else {
		document.getElementById('password-requirements-symbol').className = 'fail';
	}
	
	return score;
}

// Show the password stength dropdown
function showpass() {
	document.getElementById('password-requirements').style.maxHeight = document.getElementById('password-requirements').scrollHeight + 'px';
}

// Hide the password strength dropdown
function hidepass() {
	document.getElementById('password-requirements').style.maxHeight = '0px';
}

// Reset fields
function reset() {
	document.getElementById('user-share').className = 'hide';
	document.getElementById('user-input').className = '';
	document.getElementById('share-msg').value = '';
	location.reload();
}

// Handle page load
async function load() {
    let data = await browser.storage.local.get();
    pkeyload(data);
	var rand = Math.floor((Math.random() * 3) + 1);
	if (rand == 1) {
		document.getElementById('donationpopup').className = '';
		document.getElementById('donate').addEventListener('click',function(){window.open('https://www.paypal.me/wbrantonaddons','_blank')});
	}
    document.getElementById('loading-screen').className = 'hide';
	document.getElementById('user-share').className = 'hide';
    document.getElementById('user-input').className = '';
}

// P-Key Handler
function pkeyload(info) {
    if (!info.hidepk) {
        document.getElementById('pkeyclose').addEventListener('click',pkeyclose);
        document.getElementById('pkeyclick').addEventListener('click',function(){window.open('https://addons.mozilla.org/firefox/addon/password-generator/','_blank')});
        document.getElementById('pkeyad').className = '';
    }
}

function pkeyclose() {
    browser.storage.local.set({hidepk: true});
    document.getElementById('pkeyad').className = 'hide';
}