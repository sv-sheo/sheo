
try {

	// load CSS to webpack
	require('./../../../css/soul/desktop/index.scss'); 

	global.APPSTART = new Date().getTime();
	global.M 		= require('./../../common'); // common JS for all ss apps
	global.S        = require('./sheo'); // core app
	global.V        = require('./vendor');
	global._        = require("lodash");
	global.IO_CLIENT= require("socket.io-client"); 
	global.E 		= new EventTarget(); 		// global custom events, 

	global.STATE 	= {};
	global.SOCKETS 	= {}; // all socket.io managers (of opened connections) ... usually only one
	global.WH       = {}; // WAREHOUSE - for stuff that is used often, changed seldom - a.k.a content (in fact its just here so that STORE is not a bigass object)
	global.IDB      = {}; // indexedDB

	//global.PRELOAD_DATA 	- filled in HTML (script tag with JSON) - for basic data like language,theme etc
	global.SERVER_DATA 		= {}; // fetched after DOM & JS load

	var LOADED              = true;
	var LOADING_ERROR       = '';

	M.log.time('Main script loaded.'); // or M.log.error

} catch(e) {

	var LOADED          = false;
	var LOADING_ERROR   = e; //FAILED TO LOAD MAIN SCRIPT
	console.log('LOADING ERROR', e);

}

// fucking IE
if(window.COMPATIBLE && LOADED) {

	// AFTER DOM LOADED, BEFORE REACT
	S.other.ready.then(() => {

		//console.log('PRELOAD DATA', PRELOAD_DATA); // declared in HTML

		S.events.init_custom_events();

		return M.indexedDB.connect();

	// IndexDB started, getting content
	}).then(function(IndexedDB) {

		M.log.time('IndexedDB started.');

		IDB = IndexedDB; // populates SET and GET methods (async)
		// IDB.SET(name, value).then(callback)
		// IDB.GET(name).then(function(result) {})

		//WH 	= S.other.populate_WH();

		//return S.other.get_content(WH.db_version); // content will be stored in WH
		return Promise.resolve({ok: 1, text: "GOT CONTENT", data: {}});

	// CONNECT SOCKET
	}).then(async function(content_result) { 

		M.log.time(content_result.text);

		var socket_created 		= await M.socket.create('MAIN'); // create the main socket connection and save it to SOCKETS.MAIN // use M.socket.destroy('MAIN') to disconnect cleanly
		var socket_result 		= {ok: 0, text: '', data: {}};

		if( socket_created.ok) {

			var socket_initialized 	= await M.socket.listen_once('MAIN', 'INIT');

			if(socket_initialized.ok) {

				let test = await M.socket.execute('MAIN', 'ping', {action: 'ping'}, {return: true});

				if(test.ok) {

					socket_result.ok = 1;
					socket_result.text = 'Successfully pinged socket.';

				} else { socket_result.data = test; socket_result.text = 'Failed to fetch ping socket.'; }

			} else { socket_result.data = socket_initialized; socket_result.text = 'Failed to initialize socket.'; }

		} else { socket_result.data = socket_created; socket_result.text = 'Failed to connect to socket.' }
		
		if( !socket_result.ok ) M.log.error(socket_result, 'APP SOCKET ERROR');

		return socket_result

	// RENDER REACT
	}).then(function(result) {

		M.log.time(result.text);

		return new Promise((resolve, reject) => {

			resolve()

		});

	// RENDERED REACT, running finishing touches
	}).then(function() {

		M.log.time('SITE RENDERED');

		S.run_common_script();
		S.run_page_script(PRELOAD_DATA.page);

		// connect socket, if admin is logged in 
		//if(SERVER_DATA.admin) require('./admin');

	// ERROR    
	}).catch(function(e) { 

		var boot_error = require('./boot_error');
			boot_error.catch('bootup', e);

	});

} else {

	var error_type      	= !window.COMPATIBLE ? 'compatible' : 'loading';
	var error_object     	= window.COMPATIBLE_ERROR || LOADING_ERROR;

	var boot_error = require('./boot_error');
		boot_error.catch(error_type, error_object);

}