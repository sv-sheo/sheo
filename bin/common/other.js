
// must return an object like this {read: bool, write: bool}
exports.resolve_app_instance_rights = function(rights, owner_soul_id, logged_in_soul_id, access_link) {

    var frontend_rights = {read: false, write: false};

    if(rights && rights.read && rights.write && owner_soul_id) {

        var soul_owns_this_app_instance = (owner_soul_id === logged_in_soul_id) ? true : false;

        var read_limiters   = rights.read_limiters || {};
        var write_limiters  = rights.write_limiters || {};
            access_link     = access_link || '';
        
        // get rights from limiters by account (soul)
        var logged_in_soul_has_read_rights      = (read_limiters.souls    && read_limiters.souls[logged_in_soul_id])  ? true : false;
        var logged_in_soul_has_write_rights     = (write_limiters.souls   && write_limiters.souls[logged_in_soul_id]) ? true : false;

        // get rights from limiters by link
        var client_has_link_for_read_rights     = (read_limiters.link && read_limiters.link === access_link) ? true : false;
        var client_has_link_for_write_rights    = (write_limiters.link && write_limiters.link === access_link) ? true : false;

        // grant public rights
        if(rights.read === 'public') frontend_rights.read = true;
        if(rights.write=== 'public') frontend_rights.write = true;

        // grant limited read rights, if condition are met
        if(rights.read === 'limited') { 
            
            // if there are limited rights for write, grant read as well
            if(logged_in_soul_has_read_rights || logged_in_soul_has_write_rights || soul_owns_this_app_instance) { frontend_rights.read = true; }
            if(client_has_link_for_read_rights || client_has_link_for_write_rights) { frontend_rights.read = true; }

        }

        // grant limited write rights, if condition are met
        if(rights.write === 'limited') { 
            
            if(logged_in_soul_has_write_rights || soul_owns_this_app_instance) { frontend_rights.write = true; };
            if(client_has_link_for_write_rights) { frontend_rights.write = true; }

        }

        // grant private rights to owners
        if(rights.read === 'private' && soul_owns_this_app_instance) frontend_rights.read = true;
        if(rights.write=== 'private' && soul_owns_this_app_instance) frontend_rights.write = true;

        // grant no rights
        if(rights.read === 'none') frontend_rights.read = false;
        if(rights.write=== 'none') frontend_rights.write = false;

    }

    return frontend_rights;

}

// for handlebars reloading
exports.reload_site = async function(SITE={}, data={}) {

	var result = {ok: 0, id: '[fe1]', text: '', data: {}, error: null};

	try {

		if(SITE) {

			console.log('Executing reload site on worker '+C.server.worker_id);

			let load_args   = {site: SITE.name, site_root: SITE.root, log: true, config: SITE.config};

			let BIN         = await C.sites.load_site_bin       (load_args);
			let handlers    = await C.sites.load_site_handlers  (load_args);
			let views       = await C.sites.load_site_views     (load_args);

			if(BIN.ok)      Object.assign(SITE, BIN.data);
			if(handlers.ok) Object.assign(SITE.handlers, handlers.data);
			if(views.ok) 	Object.assign(SITE.views, views.data);
			
            // handlebars reloaded in middleware 
			let middleware_result = {ok: 1, text: 'Middleware not found.', error: null, data: {}};

			if(BIN.ok && SITE.middleware) { middleware_result = await SITE.middleware(SITE).catch((err)=>{ return {ok: 0, text: 'Unknown middleware error: '+err.message, error: err, data: {}}; }) }

			result.data.BIN 	 = M._.omit(BIN, ['data']);
			result.data.handlers = M._.omit(handlers, ['data']);
			result.data.views 	 = M._.omit(views, ['data']);

			if(BIN.ok && handlers.ok && views.ok && middleware_result.ok) {

				result = {...result, ok: 1, id: '[fi1]', text: 'Successfully reloaded site ['+SITE.name+'] on worker '+C.server.worker_id+'.'};

			} else { result.text = 'Error during SITE.other.reload_site ('+SITE?.name+') - some steps of site reload failed: \r\n'+BIN.text+'\r\n'+handlers.text+'\r\n'+views.text+'\r\n'+middleware_result.text; }

		} else { result.text = 'Error during SITE.other.reload_site ('+SITE?.name+') - invalid SITE.'; }

	} catch(error) { result = {...result, error: M.util.inspect(error), text: 'Unknown error during SITE.other.reload_site ('+SITE?.name+') - '+error?.message}; }

	return result;

}