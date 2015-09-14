var system = require('system'),
	url = system.args[1],
	page = require('webpage').create(),
	log = require('./logger').create(),
	resourceManager = require('./resource-manager').create(page),
	loadWait = 50,
	loadHandle;

setTimeout(function () {
	log.error('script timeout');
	phantom.exit(1);
}, 180e3);

phantom.onError = function(msg) {
	log.error(msg);
};

page.settings.loadImages = false;
page.settings.resourceTimeout = 120e3;
page.viewportSize = {
	width: 1024,
	height: 768
};

page.onError = function (msg) {
	log.error(msg);
};

page.onConsoleMessage = function (msg) {
	log.warn('[console]', msg);
};

page.onLoadStarted = function() {
	clearTimeout(loadHandle);
};

page.onLoadFinished = function(status) {
	// redirect may start another loading
	loadHandle = setTimeout(function () {
		if (status !== 'success') {
			log.error('page loading failed');
			log.error(page.url, url);
			phantom.exit(1);
			return;
		}
		log.info('waiting for resources...');
		resourceManager.load(function () {
			log.info('loading finished');
			system.stdout.write(page.content);
			phantom.exit();
		});
	}, loadWait);
};

log.info('requesting', url);
page.open(url);