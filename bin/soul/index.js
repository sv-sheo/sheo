
let rr = require.resolve;

exports.auth        = C.helper.force_require(rr('./auth'));
exports.validate    = C.helper.force_require(rr('./validate'));
exports.other       = C.helper.force_require(rr('./other'));
exports.pre         = C.helper.force_require(rr('./pre'));

exports.public_homepage = async function(Q, s, SITE) {
    
    Q.data.apps                 = await SITE.soul.other.get_home_apps(Q);

    M._.forEach(Q.data.apps, function(app_, app_name) { app_.host = Q.protocol + '://' + app_name + '.' + Q.true_host + Q.base_url; });

    Q.frontend.language         = Q.language;
    Q.frontend.page             = 'public_home';
    Q.data.PRELOAD_DATA         = M.tosource(Q.frontend);// must be at the end, but before rendering the final view

    s.html = SITE.views.soul.home.public.index(Q.data);
    
}

exports.private_homepage = async function(Q, s, SITE) {

    let age = (30*24*60*60); // remember soul for another 30 days
    s.cookie.set('soul', Q.cookies.soul, age/*, path, domain, http_only*/);

    let cookie_soul 	= await SITE.soul.auth.get_cookie(Q.cookies.soul, SITE.config.code_geass);
    Q.data.soul 	    = await SITE.soul.auth.prove_soul(SITE.DB, cookie_soul);

    Q.data.apps         = await SITE.soul.other.get_home_apps(Q); // must be after Q.data.soul

    M._.forEach(Q.data.apps, function(app_, app_name) { app_.host = Q.protocol + '://' + app_name + '.' + Q.true_host + Q.base_url; });
    

    Q.frontend.page         = 'private_home';
    Q.data.PRELOAD_DATA     = M.tosource(Q.frontend);// must be at the end, but before rendering the final view
    
    s.html = SITE.views.soul.home.private.index(Q.data);
    
}

/*exports.get_frontend_data = function(Q) {
    
    *console.log('CURRENT REQUESTS: ', M.util.inspect(Object.keys(R)));
    console.log('START TIME: ', M.moment(C.bootup.start_time).format('DD. MM. YYYY, HH:mm:ss'));
    console.log('UP TIME: ', M.moment(M.moment().format('x') - M.moment(C.bootup.start_time).format('x')).format('HH:mm:ss'));
    
    console.log('OS CPUS: ', M.util.inspect(M.os.cpus()));
    console.log('OS LOADAVG: ', M.util.inspect(M.os.loadavg()));
    console.log('PROCESS CPU USAGE: ', M.util.inspect(process.cpuUsage()));
    
    var tmem = M.os.totalmem();
    var fmem = M.os.freemem();
    
    console.log('TOTAL MEM: ', tmem);
    console.log('FREE MEM: ', fmem);
    console.log('FREE MEM PERCENT: ', ((tmem - fmem)/tmem*100));*
    
    var frontend_data   =   {
                                request_id:     Q.id, 
                                socket_host:    CONFIG.core.socket.host,
                                start_time:     M.moment(C.bootup.start_time).format('DD. MM. YYYY, HH:mm:ss'),
                                tmem:           M.os.totalmem(),
                                fmem:           M.os.freemem(),
                            };
    
    Q.data = frontend_data;
    
}*/

/*exports.process_requests = function(requests, Q) {
    
    Q.data.requests = requests;
    
}*/

/*exports.compile_data = function(items, Q, s, SITE) { // ARGUMENTS in correct order !
    
    Q.data.items            = items;
    Q.data.items_size       = items.size;
    delete items.size;

    Q.data.left_menu        = SITE.views.soul.left_menu(Q.data);
    Q.data.content          = SITE.views.soul.content(Q.data);
    s.html                  = SITE.views.soul.index(Q.data);
    
}*/

// kick to login if noone is logged in
/*exports.pre = function(resolve, Q, s) {
    
    if(!Q.cookies['soul']) {
        
        Q.hook      = 'none';
        s.result    = {code: 302, handled: true, message: '302 Not logged in -> Login'};
        
        s.writeHead(302, {'Location': Q.protocol + '://' + Q.host + Q.base_url + 'login'});
        s.end('');
        resolve();
        
    }
    
}*/