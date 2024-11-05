

exports.get_webpack_url = function(host, app, site_config) {

        var allowed_apps    = {actilog: 'actilog', soul: 'soul'};
        var app_name        = allowed_apps[app]; 
        var webpack_url     = 'http://unknown.webpack.url/';

        if(app_name && site_config.apps[app_name]) {

            //webpack_url = site_config.ENVIRONMENT === 'DEVELOPMENT' ? 'http://localhost:'+site_config.apps[app_name].webpack_dev_server_port+'/' : host+'files/get/build/production/'+app_name+'/';
            
            let webpack_dev_server_protocol = site_config.apps[app_name].webpack_dev_server_protocol || 'http';
            let webpack_dev_server_host     = site_config.apps[app_name].webpack_dev_server_host || 'localhost';
            let webpack_dev_server_port     = site_config.apps[app_name].webpack_dev_server_port;

            webpack_url = site_config.ENVIRONMENT === 'DEVELOPMENT' ? webpack_dev_server_protocol+'://'+webpack_dev_server_host+':'+webpack_dev_server_port+'/' : host+'files/get/build/production/'+app_name+'/'; 
        
        }

        return webpack_url;

}

exports.get_app_data = async function(SITE_DB, app_name) {

    var app_data = await DB.GET(SITE_DB, 'apps', {filter: {name: app_name}, limit: 1, format: 'single'});

    return app_data;

}

exports.get_currencies = async function(SITE_DB) {

    var currencies  = await DB.GET(SITE_DB, 'other', {filter: {name: 'currencies'}, limit: 1, format: 'single'});

        currencies  = currencies.value || {USD: {ticker: 'USD', unit: '$', format: '<unit><amount> <ticker>', decimal: '.', thousands: ','}}

    return currencies;

}

exports.get_socket_data = (SITE) => {
        
    let data            = {};
    let server_name     = SITE.config.site_socket.server;
    let server_data     = CONFIG.core.socket.servers[server_name];

    data.server         = server_name;
    data.host           = server_data.host;
    data.port           = server_data.port;
    data.protocol       = server_data.protocol;
    data.url            = server_data.protocol+server_data.host+':'+server_data.port;
    data.namespaces     = SITE.config.site_socket.namespaces;
    data.timeout        = SITE.config.site_socket.timeout;

    return data;

}