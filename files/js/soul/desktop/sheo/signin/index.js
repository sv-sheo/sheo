
exports.on_load = function() {

	S.signin.init_antibot();

}

// bind an onmousemove handler to <body>, if it fires more than 50x, it means its a human using a mouse and not a bot -> enable antibot
exports.init_antibot = function() {

	var form_ 			= document.getElementById('signin_form');
	var antibot_input 	= document.getElementById('antibot');
	var mousemove_count	= 0;
	var antibot_helper 	= function(e) { if(mousemove_count < 51) { mousemove_count++; } else { antibot_input.value = ['definitely','not','a','robot'].join(''); document.body.removeEventListener('mousemove', antibot_helper); } };

	if(form_ && antibot_input) {

		document.body.addEventListener('mousemove', antibot_helper); // after 50 mousemoves, unset the handler and set the value of antibot input

	}

}