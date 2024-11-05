
// named parameters
exports.login = ({post={}, soul={}, result={}, code_geass=0} = {}) => {

	// first check for post data error
	if(!post.error) {
		
		// validate (prove) post data
		let proofs =    {
							name: {name: 'Nick', options: {required: 1, type: 'string', max_length: 64}},
							pass: {name: 'Password', options: {required: 1, type: 'string', max_length: 64}}
						};
		
		let proved  = C.helper.prove.values({data: post.fields, proofs, lang: 'en'});

		// input data is valid
		if(proved.ok) {
			
			// now check soul
			if(soul && soul.id) {

				if(code_geass) {
					
					// check password
					let input_pass      = M._.get(post, 'fields.pass', '');
					let decrypted_pass  = C.ciphers.decrypt_sync(soul.password, code_geass);

					if(decrypted_pass === input_pass) {

						result.ok           = 1;
						result.text         = 'Successfully logged in.';
						result.errors       = [];
						result.data.soul   	= soul;

					// wrong password
					} else { result.errors.push("Incorrect password"); }
					
				// missing code geass
				} else { result.errors.push("Invalid code geass"); }

			// no admins found
			} else { result.errors.push("Invalid soul."); }
			
		// invalid data in post
		} else { result.errors = M._.concat(result.errors, proved.errors); }
		
	// error loading post data
	} else { result.errors.push(post.error); }
	
	return result;
	
}


// named parameters
exports.signin = ({post={}, result={}} = {}) => {

	// first check for post data error
	if(!post.error) {
		
		var pass_confirm 		= {}
			pass_confirm.test	= function(pass_confirm, data) { return (data.pass && data.pass === pass_confirm) ? true : false; }
			pass_confirm.error 	= {cz: 'Hesla nejsou stejná.', en: 'Passwords are not same.', de: 'Die Passwörter sind nicht gleich.'};

		var no_dots_allowed		= {}
			no_dots_allowed.test= function(nick, data) { var are_dots_regex = /[\.\{\}\'\"\,]/g; return are_dots_regex.test(nick) ? false : true; }
			no_dots_allowed.error={cz: 'Nick nesmí obsahovat tyto znaky: .,{}\"\'.', en: '.,{}\"\' symbols are not allowed.', de: '.,{}\"\' Zeichen sind nicht erlaubt.'};

		// validate (prove) post data
		let proofs =    {
							nick: 			{ name: 'Nick', 	options: {required: 1, type: 'string', min_length: 2, max_length: 64, custom: no_dots_allowed}},
							pass: 			{ name: 'Password', options: {required: 1, type: 'string', min_length: 6, max_length: 64}},
							email: 			{ name: 'E-mail', 	options: {required: 0, type: 'string', email: true, max_length: 128}},
							pass_confirm: 	{ name: '', options: {custom: pass_confirm}},
						};
		
		let proved  = C.helper.prove.values({data: post.fields, proofs, lang: 'en'});

		// input data is valid
		if(proved.ok) {

					result.ok           = 1;
					result.text         = 'Signin approved.';
					result.errors       = [];
			
		// invalid data in post
		} else { result.errors = M._.concat(result.errors, proved.errors); }
		
	// error loading post data
	} else { result.errors.push(post.error); }
	
	return result;
	
}