
exports.common 		= require('../../common');
exports.events 		= require('./events');
exports.other 		= require('./other');
exports.signin 		= require('./signin');

exports.run_common_script = function() {

	// all inputs on change and on load will get a input_success class if validation passes
	S.other.forms.bind_on_change_validation();

}

exports.run_page_script = function(page) {

	//console.log('page script', page);

	if(page === 'signin') S.signin.on_load();



}