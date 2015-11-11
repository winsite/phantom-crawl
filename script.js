'use strict';

var system = require('system'),
	page = require('webpage').create(),
	url = system.args[1];

phantom.addCookie({
	name: 'cookieconsent_dismissed',
	value: 'yes',
	domain: '.chcipraci.cz'
});

page.onError = function(msg) {
	system.stderr.write('error: ');
	system.stderr.writeLine(msg);
};

page.onConsoleMessage = function (msg) {
	system.stderr.write('console: ');
	system.stderr.writeLine(msg);
};

page.onCallback = function() {
	system.stdout.write(page.content);
	phantom.exit();
};

page.open(url, function(status) {
	if (status === 'fail') {
		phantom.exit(1);
	}

	page.evaluateAsync(function() {
		var element = document.querySelector('body');
		if (window.angular) {
			angular.getTestability(element).whenStable(window.callPhantom);
		} else {
			window.callPhantom();
		}
	});
});
