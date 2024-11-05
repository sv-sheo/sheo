

exports.index = async function({Q, s, SITE}) {

    Q.data.html             = {};
    Q.data.html.webpack_url = SITE.common.pre.get_webpack_url(Q.data.HOST, 'soul', SITE.config);
    Q.data.html.title       = 'SHEO - Just a bunch of micro-apps';
    Q.data.html.description = 'SHEO - Just a bunch of micro-apps, micro-app, activity logs, logging activity';
    Q.data.html.icon 		= 'files/get/soul/icons/logo_dark.svg';
    Q.data.app              = await DB.GET(SITE.DB, 'apps', {filter: {name: 'souls'}, format: 'single'}); // souls app

    Q.frontend.socket       = SITE.common.pre.get_socket_data(SITE);

    // logged in
    if(Q.cookies.soul)  { await SITE.soul.private_homepage(Q, s, SITE); // logged in
    } else              { await SITE.soul.public_homepage(Q, s, SITE);} // not logged in

    return {ok: 1};
    
}

exports.not_found = async function({Q, s, SITE}) {

    Q.data.html             = {};
    Q.data.html.webpack_url = SITE.common.pre.get_webpack_url(Q.data.HOST, 'soul', SITE.config);
    Q.data.html.title       = 'SHEO - Just a bunch of micro-apps';
    Q.data.html.description = 'SHEO - Just a bunch of micro-apps, micro-app, activity logs, logging activity';
    Q.data.html.icon 		= 'files/get/soul/icons/logo_dark.svg';
    Q.data.app              = await DB.GET(SITE.DB, 'apps', {filter: {name: 'souls'}, format: 'single'}); // souls app

    Q.frontend.socket   		= SITE.common.pre.get_socket_data(SITE);

    await SITE.soul.public_homepage(Q, s, SITE);

    return {ok: 1};
    
}


exports.handlebars_reload = async function({Q, s, SITE}) {

    var test = await C.process.EXECUTE_ON_MASTER({action: 'process.handlers.master.execute_on_all_workers', 
                                                    data: {message_for_workers: {action: 'process.handlers.worker.execute_site_method',
                                                            data: {site: SITE.name, method: 'common.other.reload_site', data: {}}}}});
    

    //console.log(test.resolved.resolved.data.results[1].resolved.data.message);
    Q.hook = 'none';
    
    var content = 'succesfully reloaded handlers and handlebars views<br>'+M.util.inspect(test, showHidden=true, depth=20);
    s.result    = {code: 200, handled: true, message: '200 Request handled by site.'};
                    
    s.writeHead(200, {'Content-Type': 'text/plain'});
    s.end(content);
    
    return {ok: 1};
    
}

// DEPRECATED
/*exports.acme_challenge = function(resolve, reject, Q, s, SITE, DB) {

    console.log('ACME CHALLENGE: ', Q.params.key);
    Q.hook = 'none';

    var key = Q.params.key;
    //var acme_challenge_path = M.path.join(SITE.config.root, '../../../certificates/.well-known/acme-challenge'); // changed after migrating to RPi 2022
    var acme_challenge_path = M.path.join(SITE.config.root, '../../../../certificates/acme_challenge/.well-known/acme-challenge');
    var acme_challenge_file = M.path.join(acme_challenge_path, key);

    //console.log(acme_challenge_path, acme_challenge_file);
    
    if(M.fs.existsSync(acme_challenge_file)) {
            
        var file_content = M.fs.readFileSync(acme_challenge_file);

        s.result = {code: 200, handled: true, message: '200 Request handled by site.'};

        s.writeHead(200, {'Content-Type': 'text/plain'});
        s.end(file_content);

        resolve();

    } else {

        s.result    = {code: 200, handled: true, message: '200 Request handled by site.'};
                    
        s.writeHead(200, {'Content-Type': 'text/plain'});
        s.end('Couldnt find acme challenge file: '+key);

        resolve();

    }

}*/