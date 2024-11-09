
// LOGIN PAGE 
exports.login_view = async function({Q, s, SITE}) {

	B.cookie_soul 	= await SITE.soul.auth.get_cookie(Q.cookies.soul, SITE.config.code_geass);
	Q.data.soul 	= await SITE.soul.auth.prove_soul(SITE.DB, B.cookie_soul);

	SITE.soul.auth.kick_logged_in(Q, s);

	Q.data.request_id       = Q.id;
	Q.data.html 			= Q.data.html || {};
	Q.data.html.webpack_url = SITE.common.pre.get_webpack_url(Q.data.HOST, 'soul', SITE.config);
	Q.data.html.title       = 'LOGIN - SHEO - Just a bunch of micro-apps';
	Q.data.html.description = 'SHEO - Just a bunch of micro-apps, micro-app, activity logs, logging activity';
	Q.data.html.icon 		= 'files/get/soul/icons/logo_dark.svg';
	Q.data.app              = await DB.GET(SITE.DB, 'apps', {filter: {name: 'souls'}, format: 'single'}); // souls app

	SITE.soul.other.register_partials(SITE.views.soul.partials);

	// check for data from previous handler
	if(Q.cookies.previous) { 

		Q.data.result = JSON.parse(Q.cookies.previous);
		s.cookie.delete('previous');
		
	}

	Q.frontend.page 			= 'login';
	Q.frontend.request_id   	= Q.id;
	Q.frontend.socket   		= SITE.common.pre.get_socket_data(SITE);
	Q.data.PRELOAD_DATA         = M.tosource(Q.frontend);// must be at the end, but before rendering the final view

	s.html              		= SITE.views.soul.auth.login(Q.data);

	return {ok: 1};
    
}

// HOME PAGE OF LOGGED IN ADMIN 
exports.account = async function({Q, s, SITE}) {
	
	let cookie_soul 	= await SITE.soul.auth.get_cookie(Q.cookies.soul, SITE.config.code_geass);
	Q.data.soul 	    = await SITE.soul.auth.prove_soul(SITE.DB, cookie_soul);

	SITE.soul.auth.kick_not_logged_in(Q, s);

	SITE.soul.pre.compile_account_data(Q, s);

	Q.data.request_id       = Q.id;
	Q.data.html 			= Q.data.html || {};
	Q.data.html.webpack_url = SITE.common.pre.get_webpack_url(Q.data.HOST, 'soul', SITE.config);
	Q.data.html.title       = 'SHEO - Just a bunch of micro-apps';
	Q.data.html.description = 'SHEO - Just a bunch of micro-apps, micro-app, activity logs, logging activity';
	Q.data.html.icon 		= 'files/get/soul/icons/logo_dark.svg';
	Q.data.app              = await DB.GET(SITE.DB, 'apps', {filter: {name: 'souls'}, format: 'single'}); // souls app

	Q.data.apps 			= await SITE.soul.other.get_soul_apps(Q);

	M._.forEach(Q.data.apps, function(app_, app_name) { app_.host = Q.protocol + '://' + app_name + '.' + Q.true_host + Q.base_url; });
	
	Q.frontend.page 		= 'account';
	Q.frontend.request_id   = Q.id;
	Q.frontend.socket   	= SITE.common.pre.get_socket_data(SITE);
	Q.data.PRELOAD_DATA   	= M.tosource(Q.frontend);// must be at the end, but before rendering the final view


	s.html              = SITE.views.soul.auth.account(Q.data);

	return {ok: 1};
    
}

// ACTUAL LOGIN OF ADMIN
exports.login_process = async function({Q, s, SITE}) {

	var b 			= {}; // local bin;

	b.cookie_soul 	= await SITE.soul.auth.get_cookie(Q.cookies.soul, SITE.config.code_geass);
	Q.data.soul 	= await SITE.soul.auth.prove_soul(SITE.DB, b.cookie_soul);

	SITE.soul.auth.kick_logged_in(Q, s);

	Q.data.result 	= C.helper.new_result();

	// get POST data, structure {field: false, files: false, error: false}	
	Q.data.post 	= await Q.post;

	// get souls from DB filtered by POST data
	var souls 		= await SITE.soul.auth.get_souls_from_login(Q, SITE);

	var souls_keys 	= souls ? Object.keys(souls) : [];
	var souls_count = souls ? souls_keys.length : 0;

	if(souls_count === 1) {

		// data needed for validation
		Q.data.soul        	= souls[souls_keys[0]];
		Q.data.code_geass   = SITE.config.code_geass;

		// validate data
		Q.data.result       = SITE.soul.validate.login(Q.data);
		
		if(Q.data.result.ok) {
			
			// the cookie shall have value like, encrypted
			// <id>_<nick>_<time_of_login>
			let soul   = Q.data.result.data.soul;
		
			let now     = M.moment().format('x');
			let cookie  = [soul.id, soul.nick, now].join('_');
				cookie 	= C.ciphers.encrypt_sync(cookie, Q.data.code_geass);
			let age 	= Q.data.post.fields.remember ? (30*24*60*60) : undefined; // if rmember is checked, remember the login for 30 days

			s.cookie.set('soul', cookie, age, /*path*/ null, /*domain*/Q.host,/*, http_only*/);
			// redirect at end

			console.log('OOOOOOOOOOOOOOOOOOOOOOO', cookie, age, Q.host);
		
		} // invalid data; errors defined in login.validate

	} else {
		
		if(souls_count < 1) { Q.data.result.errors.push('Soul not found.'); } 
		else {

			Q.data.result.errors.push('Your nick is not unique, please use your e-mail or <NICK>.<ID> to log in.');
			Q.data.result.errors.push('Souls with same nick:');
			
			M._.forEach(souls, function(soul) { Q.data.result.errors.push(soul.nick+'.'+soul.id+' ('+soul.email+')'); });

		}
	
	}

	if(Q.data.result.ok) {
		
		s.redirect('account'); 
	
	} else {

		Q.data.result.data = Q.data.post.fields;
		s.inner_redirect('login', Q.data.result);

	}
    
}

// LOGOUT PROCESS
exports.logout_process = async function({Q, s, SITE}) {
    console.log('??????????????????????????');
    s.cookie.delete('soul', /*path*/ null, /*domain*/Q.host,/*, http_only*/);

	console.log('OOOOOOOOOOOOOOOOOOOOOOO', Q.host);
    s.redirect('login');

	return {ok: 1};
    
}


// SIGNIN PAGE 
exports.signin_view = async function({Q, s, SITE}) {

		B.cookie_soul 	= await SITE.soul.auth.get_cookie(Q.cookies.soul, SITE.config.code_geass);
		Q.data.soul 	= await SITE.soul.auth.prove_soul(SITE.DB, B.cookie_soul);

		SITE.soul.auth.kick_logged_in(Q, s);

		Q.data.request_id       = Q.id;
		Q.data.html 			= Q.data.html || {};
		Q.data.html.webpack_url = SITE.common.pre.get_webpack_url(Q.data.HOST, 'soul', SITE.config);
		Q.data.html.title       = 'LOGIN - SHEO - Just a bunch of micro-apps';
		Q.data.html.description = 'SHEO - Just a bunch of micro-apps, micro-app, activity logs, logging activity';
		Q.data.html.icon 		= 'files/get/soul/icons/logo_dark.svg';
		Q.data.app              = await DB.GET(SITE.DB, 'apps', {filter: {name: 'souls'}, format: 'single'}); // souls app

		//SITE.soul.other.register_partials(SITE.views.soul.partials);

		// check for data from previous handler
		if(Q.cookies.previous) { 

			Q.data.result = JSON.parse(Q.cookies.previous);
			s.cookie.delete('previous');
			
		}

		Q.frontend.page 		= 'signin';
		Q.frontend.request_id   = Q.id;
		Q.frontend.socket   	= SITE.common.pre.get_socket_data(SITE);
		Q.data.PRELOAD_DATA   	= M.tosource(Q.frontend);// must be at the end, but before rendering the final view

		s.html              	= SITE.views.soul.auth.signin(Q.data);
    
}

// ACTUAL LOGIN OF ADMIN
exports.signin_process = async function({Q, s, SITE}) {

	var b 			= {}; // local bin;

	b.cookie_soul 	= await SITE.soul.auth.get_cookie(Q.cookies.soul, SITE.config.code_geass);
	Q.data.soul 	= await SITE.soul.auth.prove_soul(SITE.DB, b.cookie_soul);

	SITE.soul.auth.kick_logged_in(Q, s);

	Q.data.result 	= C.helper.new_result();

	// get POST data, structure {field: false, files: false, error: false}
	Q.data.post 	= await Q.post;

	var post_data 	= Q.data.post.fields;

	// recaptcha
	if(post_data.antibot === 'definitelynotarobot') {

		// validate data
		Q.data.result       = SITE.soul.validate.signin(Q.data);
		
		if(Q.data.result.ok) {

			let reserved_nicknames = {sheo: 1, lubos: 1};

			if( !reserved_nicknames[post_data.nick] ) {

				// find out if nick and email is unique
				let souls_with_same_nick 	= await DB.GET(SITE.DB, 'souls', {filter: {nick: post_data.nick}}).catch(err=>err);
				let souls_with_same_email 	= await DB.GET(SITE.DB, 'souls', {filter: {email: post_data.email}}).catch(err=>err);
				let last_soul				= await DB.GET(SITE.DB, 'souls', {order_by: ['id', 'desc', true], limit: 1, format: 'single'}).catch(err=>err);

				if(C.helper.not_error(souls_with_same_nick, souls_with_same_email, last_soul)) {

					let soul_ids_with_same_nick 	= Object.keys(souls_with_same_nick);
					let soul_ids_with_same_email	= Object.keys(souls_with_same_email);

					// if email is filled out, it must be unique
					if( !(post_data.email && soul_ids_with_same_email.length > 0) ) {

						// if email is not provided, and nick is not unique, throw an error
						if( !(!post_data.email && soul_ids_with_same_nick.length > 0) ) {

							// everything OK, encrypt password
							let encrypted_pass  = C.ciphers.encrypt_sync(post_data.pass, SITE.config.code_geass);

							let new_id 			= (last_soul && last_soul.id) ? (last_soul.id + 1) : 1;
							let new_soul 		= {id: new_id, email: post_data.email, nick: post_data.nick, password: encrypted_pass, type: 'user', active: 1};

							var insert 			= await DB.SET(SITE.DB, 'souls', new_soul).catch(err=>err);

							if( C.helper.not_error(insert) && insert?.inserted) {

								// insert OK -> create new actilog for the new soul
								let new_actilog = await SITE.soul.other.create_new_actilog(SITE, new_soul);

								// INSERT OK -> login the new user
								// the cookie shall have value like, encrypted: <id>_<nick>_<time_of_login>
								let soul   	= new_soul;
								let now     = M.moment().format('x');
								let cookie  = [soul.id, soul.nick, now].join('_');
									cookie 	= C.ciphers.encrypt_sync(cookie, SITE.config.code_geass);

								s.cookie.set('soul', cookie, /*age*/null, /*path*/ null, /*domain*/Q.host,/*, http_only*/);
						
								Q.data.result.ok 		= 1;
								Q.data.result.text 		= 'Succesfully created new soul: '+soul.nick;
								Q.data.result.data 		= {soul};
								Q.data.result.errors 	= [];

								// redirect at end

							} else { Q.data.result.ok = 0; Q.data.result.errors.push('Failed to insert new soul (DB Error).', insert?.message) };

						} else { Q.data.result.ok = 0; Q.data.result.errors.push('This nickname has already been used. Either fill in an e-mail or use different nick.') };

					} else { Q.data.result.ok = 0; Q.data.result.errors.push('This E-mail has already been registered.') };

				} else { Q.data.result.ok = 0; Q.data.result.errors.push('Failed to check unique nicknames and emails or get last ID - nicknames: '+souls_with_same_email?.message+'; emails: '+souls_with_same_email?.message+'; last ID: '+last_soul?.message) };

			} else { Q.data.result.ok = 0; Q.data.result.errors.push('This nickname is reserved, please use a different one.') };
		
		} // errors set in validate.signin

	} else { Q.data.result.errors.push('Are you a robot?'); }

	if(Q.data.result.ok) {

		s.redirect('account');

	} else {

		Q.data.result.data = Q.data.post.fields; // set data for back-fill of form
		s.inner_redirect('signin', Q.data.result); // redirect back to sign page with error

	}
    
}