var button = document.getElementsByTagName('button');
for (i = 0; i < button.length; i++) {
	button[i].addEventListener('click',openPage);
}

// Opens page
function openPage(e) {
	var page = e.target.id;
	if (page == 'read') {
		document.getElementById('loader').className = 'purple';
	}
	if (document.getElementById('menu-buttons')) {
		document.getElementById('menu-buttons').className = 'hide';
	}
	document.getElementById('loading-screen').className = '';
	window.location = page + ".html";
}