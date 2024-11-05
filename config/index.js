
// conf = conf of SITE, environment of CORE is available in process.env
// only sensitive data and site-specific environment variables should be stored in SITE .conf

// APP EXTENSIONS
let create_actilog_config = require('../apps/actilog/config'); // a function that accepts 2 arguments - conf (from .env) and current site config

// site config will be merged with CORE config and saved to CONFIG[site] as a new object
module.exports = function(conf) {

    // can, and will be, extended by individual app configs (called at the end) - for example, the config.hosts will be extended by actilog
    var config = {

        name:   'sheo',
        //root: <path>, ... added in CORE site setup
        hosts: {   

			"www.sheo.cz":  "www.sheo.cz", 
			"m.sheo.cz":  "m.sheo.cz", 
			"s.sheo.cz":  "s.sheo.cz", 
			"sheo.cz":    "sheo.cz", 
			"sheo.ss":    "sheo.ss", 

        },

        //workers:        conf.workers, // !! EACH SITE HAS TO BE RUN ON EACH WORKER ... since we can't control which worker will handle which requests
        is_https:           conf.is_https           ? true : false,             // only if you have a standalone domain name for core (i.e. https://core.io)
        port:               parseInt(conf.port)     || 80,                      // 80 = default for HTTP sites
        base_url:           conf.base_url           || '/',
        code_geass:         conf.code_geass         || process.env.code_geass,  // web admin shares same code geass as the CORE web server
        default_country:    conf.default_country    || 'EN',                    // default country - for localhost - (country codes via http://www.ip2country.net/ip2country/country_code.html)
        webpack_dev_port:   parseInt(conf.webpack_dev_port) || 0,


	};

	// DIRS
    config.dir = {

            bin:        './bin', 
            config:     './config', 
            handlers:   './handlers', 
            views:      './views', 

    };

	// LOGS
    config.logs = {

            path:           './logs',
            
            request:        {

                // log types by hooks (Q.hook)
                by_hook: { /* ... set via the get_request_log_type_config_by_hook method call below */},

            }

    };
				config.logs.request.by_hook = C.helper.config.get_request_log_type_config_by_hook(conf);

	// FILES
	config.files = {

            dir:        'files',
            temp_dir:   './files/temp', // not required, if missing, taken from core config
            max_size:   20, // max size in MB of all files in POST

    };

    // SOCKET
    config.site_socket = { // cannot be config.socket - do not mix config of core.socket and site.socket

        enabled:            conf.socket_enabled ? true : false,
        server:             conf.socket_server || false,                // should be a name of some server out of CONFIG.core.socket.servers
        namespaces:         {MAIN: '/sheo', ACTILOG: '/sheo_actilog'},  // should be site name or <site_name>_admin etc (e.g. core_admin; core_chatroom; etc)  ... must be server wide unique
        timeout:            parseInt(conf.socket_timeout) || 0,         // seconds, ... 0 = no timeout
        artificial_delay:   parseInt(conf.socket_artificial_delay) || 0,// milliseconds - for dev purposes only
        
    };
    
	// REQUEST
    config.request =    {

            timeout:    25, // in seconds

    };

	// DB
    config.db = {

            host:       conf.DB_host, // always localhost - even on RPi - when hosting DB on the same machine
            port:       parseInt(conf.DB_port) || 28015,
            db:         conf.DB_name,
            user:       conf.DB_user,        // read /sites/project/SETUP README on how to create DB user, and new password and new code geass
            pass:       conf.DB_password,    // its right in fron of you. pol encrypted in 2021
            authdb:     conf.DB_auth_db,

            shadow_db: ["other", "souls"], // name of collections to save to shadow DB

    };

	// LANGUAGES
    config.languages = {

		default:    'en',
		supported:  ['cz', 'en', 'de'],
		by_country: {CZ: 'cz', DE: 'de'}, // KEYS must be country codes returned by M.country() ... possible values here: http://www.ip2country.net/ip2country/country_code.html
        data:       {cz: {text: 'Česky'}, en: {text: 'English'}, de: {text: 'Deutsch'}},

	};

    // MAIL
	config.mail = {

        providers: {

            nodemailer: { enabled: false, }, // only one nodemailer (for whole server) per process (worker/master)
            brevo: { API_KEY: conf.mailer_brevo_API_KEY || '', }, // only 1 brevo API_KEY for whole server

        }

    };

    // APPS
    config.apps     = {};

    config.apps.soul = { webpack_dev_server_port: 4337 } // soul is considered as main sheo site, but for webpack purposes, it has its own port

    create_actilog_config(conf, config); // fills config.apps.actilog and extends config.hosts and other



    var core_config_clone = M._.cloneDeep(CONFIG.core);

    config = M._.merge(core_config_clone, config); // structuredClone cant be used due to CONFIG.core.logs.log being a stream (a function)

    return config;

}
