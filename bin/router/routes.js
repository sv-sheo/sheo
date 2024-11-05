
let not_found_url 			= '(<a>(/<b>(/<c>(/<d>(/<e>(/<f>(/<g>(/<h>(/<ch>(/<i>(/<j>(/<k>(/<l>(/<m>(/<n>(/<o>))))))))))))))))';
let files_get_url 			= 'files/get/<p1>(/<p2>(/<p3>(/<p4>(/<p5>(/<p6>(/<p7>(/<p8>(/<p9>(/<p10>)))))))))';

module.exports = 
        
        {

			// grouped by sub-domains
			"sheo": {
        
				// FILES
                'files-get':        {url: files_get_url, handler: 'files/get_file'},

                //'auto':             {url: '<handle_0>/<handle_1>(/<user_id>)', handler: '<handle_0>/<handle_1>/detail', regexps: {'<user_id>': /^\d+$/}},
    
                //'acme_challenge':   {url: '.well-known/acme-challenge/<key>', handler: 'index/acme_challenge'}, // deprecated
                
                // INDEX ROUTE
                'index':            {url: '', handler: 'index/index'},
    
                // AUTH
                'login_page':       {url: 'login', handler: 'soul/auth/login_view', method: 'get'},
                'login_process':    {url: 'login', handler: 'soul/auth/login_process', method: 'post'},
                'logout_process':   {url: 'logout', handler: 'soul/auth/logout_process', method: 'get'},
                'soul_account':     {url: 'account', handler: 'soul/auth/account', method: 'get'}, // temporary
    
                'signin_page':       {url: 'signin', handler: 'soul/auth/signin_view', method: 'get'},
                'signin_process':    {url: 'signin', handler: 'soul/auth/signin_process', method: 'post'},
                
                // HANDLEBARS RELOAD
                'handlebars-reload':{url: 'handlebars_reload', handler: 'index/handlebars_reload'},
    
                // 404 ROUTE - has to be last
                'not_found':        {url: not_found_url, handler: 'index/not_found'},    

			},

        }