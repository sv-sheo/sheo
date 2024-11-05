

exports.bind_on_change_validation = function() {

	// all inputs on change and on load will get a input_success class if validation passes
	var DOM_inputs = document.getElementsByClassName('input');

	Array.from(DOM_inputs).forEach(function(DOM_input) {

		DOM_input.addEventListener('keyup', S.other.forms.native_input_validate);
		DOM_input.addEventListener('change', S.other.forms.native_input_validate);

		// validate on load
		S.other.forms.native_input_validate({currentTarget: DOM_input});

	});

}

exports.native_input_validate = function(e) {

	var input 		= e.currentTarget;
	var input_name 	= input.name;
	var value 		= input.value;
	var valid 		= input.checkValidity();

	//console.log('CHANGED INPUT '+input_name+': '+value);

	if(valid) 	{ input.classList.add('input_valid'); }
	else 		{ input.classList.remove('input_valid'); }

}