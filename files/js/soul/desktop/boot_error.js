
// catch boot error (COMPATIBLE | NOT LOADED | BOOT)
exports.catch = function(type, error) {

	type = type ? type : 'preload'; 						// compatible | bootup | loading
	error= error || new Error('UNKNOWN PRELOAD ERROR'); 	// error = Instance of Error 

	console.log('%c '+type.toUpperCase()+' ERROR: '+error.message, 'color: red; font-weight:bold;');
	console.log(error);

	// show the error when the DOM is ready
	document.onreadystatechange = function() {

		// might run twice, but its ok
		if(document.readyState === 'interactive' || document.readyState === 'complete') {

		}

	};

}