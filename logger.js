var Logger  = function () {
	var system = require('system'),
		append = function (level, messages) {
			var message = [level].concat(messages).join(' ');
			system.stderr.writeLine(message);
		};

	this.debug = function () {
		append('debug:', Array.prototype.slice.call(arguments));
	};

	this.info = function () {
		append('info:', Array.prototype.slice.call(arguments));
	};

	this.warn = function () {
		append('warn:', Array.prototype.slice.call(arguments));
	};

	this.error = function () {
		append('error:', Array.prototype.slice.call(arguments));
	};
};

exports.create = function () {
	return new Logger();
};