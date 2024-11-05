
// get soul from cookie and resolve with it ({id, nick, time})
exports.get_cookie = async function(soul_cookie, geass) {

	let cookie_soul = false;

	if(soul_cookie) {
		
		let cookie 		= C.ciphers.decrypt_sync(soul_cookie, geass);
		let soul 		= cookie.split('_'); 
			cookie_soul	= {
				
				id: 	parseInt(soul[0]), 
				nick: 	soul[1], 
				time: 	parseInt(soul[2]),
			
			}
		
	}

	return cookie_soul;
    
}

// prove cookie - check if {id} exists in DB, return false if its not legit, {soul object} if it is
exports.prove_soul = async function(SITE_DB, soul) { // soul must be object returned by soul.auth.get_cookie (above)

	let DB_soul = false;

	if(soul && soul.id) {

		DB_soul = await DB.GET(SITE_DB, 'souls', {get: soul.id}); // soul.id must be an integer

		// adjust doul data
		if(DB_soul && C.helper.not_error(DB_soul)) {
			
			DB_soul.time 			= soul.time;
			DB_soul.logged_in_time 	= M.moment(DB_soul.time).format('D.M.Y HH:mm:ss');

			delete DB_soul.password;

		}

	}

	return DB_soul;
    
}

exports.get_souls_from_login = async function(Q, SITE) {


	var data 		= Q.data.post.fields || {};
	var soul_name	= data.name || '';
	var login_souls	= soul_name ? await DB.GET(SITE.DB, 'souls', {filter: {nick: soul_name, $or: {email: soul_name}} }) : null;
	var souls_count = login_souls ? Object.keys(login_souls).length : 0;

	// if no souls found, try the <NICK>.<ID>format
	if(souls_count === 0) {

		var soul_split 	= soul_name.split('.');
		var soul_nick_ 	= soul_split[0];
		var soul_id 	= parseInt(soul_split[1]) || 0;

		if(soul_nick_ && soul_id) {

			var souls_try_2 = await DB.GET(SITE.DB, 'souls', {filter: {nick: soul_nick_, id: soul_id}, format: 'single'});

			if(souls_try_2 && souls_try_2.id) { login_souls = {}; login_souls[souls_try_2.id] = souls_try_2; }

		}

	}

	return login_souls;

}

// redirect to admin page (result), if a logged-in admin tries to log in
exports.kick_logged_in = function(Q, s) {
    
    if(Q.data.soul) s.redirect('account');
    
}

// redirect to admin page (result), if a logged-in admin tries to log in
exports.kick_not_logged_in = function(Q, s) {
    
    if(!Q.data.soul) s.redirect('login');
    
}