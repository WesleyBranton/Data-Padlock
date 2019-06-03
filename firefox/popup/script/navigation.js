// Load page
function nav(page) {
	showLoading();
	window.location.href = './' + page + '.html';
}

// Show the loading bar
function showLoading() {
	if (document.getElementById('user-share')) {
		document.getElementById('user-share').className = 'hide';
	}
	if (document.getElementById('user-input')) {
		document.getElementById('user-input').className = 'hide';
	}
	if (document.getElementById('menu-buttons')) {
		document.getElementById('menu-buttons').className = 'hide';
	}
	document.getElementById('loading-screen').className = '';
}