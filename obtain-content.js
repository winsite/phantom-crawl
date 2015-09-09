var system = require('system'),
	url = system.args[1],
	page = require('webpage').create(),
	log = require('./logger').create(),
	resourceManager = require('./resource-manager').create(page);

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

log.info('requesting', url);
page.open(url, function (status) {
	if (status !== 'success') {
		log.error('page loading failed');
		phantom.exit(1);
	}
	log.info('waiting for resources...');
	resourceManager.load(function () {
		log.info('loading finished');
		system.stdout.write(page.content);
		phantom.exit();
	});
});