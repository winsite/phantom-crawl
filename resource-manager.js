var log = require('./logger').create();

/**
 * Seznam neodbavených HTTP requestů
 */
var RequestList = function () {
	var requests = {};

	this.add = function (request) {
		requests[request.id] = request;
	};

	this.remove = function (id) {
		delete requests[id];
	};

	this.size = function () {
		return Object.keys(requests).length;
	};
};

/**
 * Správce stahovaných zdrojů
 * @param page	PhantomJS webpage objekt
 * @param resourceWait	Doba neaktivity, po které se stránka považuje za načtenou
 */
var ResourceManager = function (page, resourceWait) {
	var requestList = new RequestList(),
		callbacks = [],
		notifyHandle = null,
		notify = function () {
			callbacks.forEach(function (callback) {
				callback();
			});
		},
		wait = function () {
			clearTimeout(notifyHandle);
			if (requestList.size() === 0) {
				notifyHandle = setTimeout(notify, resourceWait);
			}
		};

	page.onResourceRequested = function (requestData) {
		requestList.add(requestData);
		clearTimeout(notifyHandle);
	};

	page.onResourceReceived = function (response) {
		if (response.stage === 'end') {
			requestList.remove(response.id);
			wait();
		}
	};

	page.onResourceError = function (resourceError) {
		requestList.remove(resourceError.id);
		log.warn('resource error', resourceError.url, JSON.stringify(resourceError));
		wait();
	};

	page.onResourceTimeout = function (request) {
		requestList.remove(request.id);
		log.warn('resource timeout', request.url, JSON.stringify(resourceError));
		wait();
	};

	/**
	 * Spustí callback po načtení všech zdrojů stránky
	 * @param callback
	 */
	this.load = function (callback) {
		callbacks.push(callback);
		wait();
	};
};

exports.create = function (page, resourceWait) {
	return new ResourceManager(page, resourceWait || 50);
};