browser.browserAction.onClicked.addListener(launch);

// Open the extension page
function launch() {
	browser.windows.create({
		type:"popup",
		url:"/popup/main.html"
	});
}