

exports.custom = require('./events'); 		// custom event definitions
exports.handlers = require('./handlers'); 	// handlers may be defined in deferent parts of app

exports.init_custom_events = function() {

	E.addEventListener('ON_SOCKET_STATE_CHANGE', S.events.handlers.HANDLE_SOCKET_STATE_CHANGE); // dispatched dynamically

	// a shortcut for a shortcut
	E.dispatch = S.events.dispatch;

}

// for dynamic (inline) dispatching
exports.create = function(name, data) {

	return new CustomEvent(name, {detail: data});

}

// shortcut for dispathing
exports.dispatch = function(name, data) {

	E.dispatchEvent(S.events.create(name, data));

}