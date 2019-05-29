var button = document.getElementsByTagName('button');
for (i = 0; i < button.length; i++) {
	button[i].addEventListener('click',openPage);
}

function openPage(e) {
	var page = e.target.id;
	window.location = page + '.html';
}