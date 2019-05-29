document.getElementById('return').addEventListener('click',menu);
document.getElementById('copy').addEventListener('click',encryptMsg);
document.getElementById('secret').addEventListener('keyup',verify);
document.getElementById('code').addEventListener('keyup',verify);
verify();

function encryptMsg() {
	var success = document.getElementById('success');
	success.style.display = 'none';
	
	var message = document.getElementById("secret");
	var passphrase = document.getElementById("code");
	var encrypted = CryptoJS.AES.encrypt(message.value, passphrase.value);
	var tempCopy = document.createElement('input');
	tempCopy.type = 'text';
	tempCopy.value = encrypted;
	tempCopy.readOnly = true;
	document.body.appendChild(tempCopy);
	tempCopy.select();
	document.execCommand("Copy");
	tempCopy.parentNode.removeChild(tempCopy);
	message.value = '';
	passphrase.value = '';
	success.style.display = 'block';
	verify();
}

function verify() {
	if (document.getElementById('secret').value.length > 0 && document.getElementById('code').value.length > 0) {
		document.getElementById('copy').disabled = false;
	} else {
		document.getElementById('copy').disabled = true;
	}
}

function menu() {
	window.location.href = 'main.html';
}