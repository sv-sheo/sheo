
exports.test = C.promise.new(function(resolve, reject, Q, socket, SITE, DB, data, result) {
    
    console.log('USERS TEST', data);
    
    result.data.q_id = Q.id;
    result.data.site = SITE.name;
    result.data.db  = DB.shadow;
    result.data.data  = data;
    
    socket.emit('test_users_back', result);
    
   resolve(result); 
    
});


exports.add_doc = C.promise.new(function(resolve, reject, Q, socket, SITE, DB, data, result) {
    
    console.log('ADD DOC', data);
    
    var my_key = Math.floor(Math.random()*100);
    
    DB.SET('shadow_test_3', {my_key: my_key})
    .then((set) => {
        
        result.ok = 1;
        result.data.q_id = Q.id;
        result.data.site = SITE.name;
        result.data.data  = set;

        socket.emit('add_doc', result);

       resolve(result);
        
        
    }).catch(reject); 
    
});

exports.get_docs = C.promise.new(function(resolve, reject, Q, socket, SITE, DB, data, result) {
    
    console.log('GET DOCS', data);
    
    DB.GET('shadow_test_2')
    .then((items) => {
        
        result.ok = 1;
        result.data.q_id = Q.id;
        result.data.site = SITE.name;
        result.data.db  = DB.shadow;
        result.data.items  = items;

        socket.emit('test_users_back', result);

       resolve(result);
        
        
    }).catch(reject); 
    
});

exports.remove_docs = C.promise.new(function(resolve, reject, Q, socket, SITE, DB, data, result) {
    
    console.log('REMOVE DOCS', data);
    
    DB.REMOVE('shadow_test_3')
    .then((remove) => {
        
        result.ok = 1;
        result.data.q_id = Q.id;
        result.data.site = SITE.name;
        result.data.data  = remove;

        socket.emit('remove_docs', result);

       resolve(result);
        
        
    }).catch(reject); 
    
});

exports.shutdown = C.promise.new(function(resolve, reject, Q, socket, SITE, DB, data, result) {
    
    console.log('SHUTDOWN', data);
    
    //process.send({wid: C.server.worker_id, action: 'shutdown', trigger: 'Shutdown from site.'});

    C.process.EXECUTE_ON_MASTER({action: 'shutdown', worker_id: M.cluster.worker.id, data: {trigger: 'sheo.cz/test page'}})
            .then((result) => { console.log('SHUTDOWN SUCCESS'); })
            .catch((error) => { C.logger.catch_process_error({text: 'SHUTDOWN ERROR: '+error.message, error: error}) });
    
    resolve();
    
});