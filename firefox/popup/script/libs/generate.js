function generateIV(size) {
	var outputArray = new Array(size);
	for (i = 0; i < size; i++) {
		outputArray[i] = Math.floor(Math.random() * 255);
	}
	return outputArray;
}

function start(msg,password,mode) {
	var pass = new buffer.SlowBuffer(password.normalize('NFKC'));
	var salt = new buffer.SlowBuffer("someSalt".normalize('NFKC'));
	var N = 1024, r = 8, p = 1, dkLen = 32;
	scrypt(pass, salt, N, r, p, dkLen, function(error, progress, key) {
		if (key) {
			if (mode == 1) {
				encrypt(msg,key);
			} else {
				decrypt(msg,key);
			}
		}
	});
}