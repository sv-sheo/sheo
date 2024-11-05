exports.test = function(resolve, reject, Q, s, SITE) {
    
    

    var test = SITE.views.test.test.test({test: 'lalala'});
    var body = SITE.views.test.body({h1: 'WELCOME TO SERVER SHEO', text: 'to my handlebars nodejs routed fully asynchronous and 100% awesome server!!!', test: test}); 
    
    s.html = SITE.views.test.index({body: body, request_id: Q.id, socket_host: CONFIG.core.socket.host});
    
    /*s.write(SITE.views.index({body: body}));
    s.end();*/
    
    resolve();
    
};

exports.lalala = function(resolve, reject, Q, s, SITE) {
    
    s.html = 'Welcome to route lalala!';
    
    resolve();
    
};

exports.ahoj = function(resolve, reject, Q, s, SITE) {
    
    s.html =  'Welcome to route ahoj!';
    
    resolve();
    
};

exports.not_found = function(resolve, reject, Q, s, SITE) {
    
    s.html = 'CUSTOM 404 PAGE';
    
    resolve();
    
};

exports.file = function(resolve, reject, Q, s, SITE) {
    
    s.result    = {code: 200, handled: true, message: '200 Request handled by site.'};
    
    var file_path = M.path.join(SITE.config.root, 'test.jpg');
    console.log(file_path);
    
    M.fs.stat_async(file_path)
    .then((data) => {
        
        s.html = '';
        
        s.setHeader('Content-Type', 'image/jpeg')
        s.setHeader('Content-Length', data.size)
        
        console.log('file exists');
        console.log(data);
        
        var stream = M.fs.createReadStream(file_path);
            stream.pipe(s);
        
        stream.on('end', function() {
            
            console.log('ended response file')
            resolve();
            
        });
        
    }).catch((err) => {
        
        console.log('file error');
        console.log(M.util.inspect(err));
        s.writeHead(404, {'Content-Type': 'text/plain'});
        s.end('no file');
        
        resolve();
        
    })
    
    //s.html = '';
    
    //resolve();
    
};

exports.form = function(resolve, reject, Q, s, SITE, DB) {

    Q.post.then((POST) => {
        
        s.html = SITE.views.test.form({FIELDS: M.util.inspect(POST.fields),FILES: M.util.inspect(POST.files), QUERY: M.util.inspect(Q.query), HEADERS: M.util.inspect(Q.headers), ERROR: M.util.inspect(POST.error)});
        resolve();
        
    }).catch(reject);
    
};