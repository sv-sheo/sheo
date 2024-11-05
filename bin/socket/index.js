
let rr = require.resolve;

exports.handlers    = C.helper.force_require(rr('./handlers')); // methods for handling socket actions
exports.router      = C.helper.force_require(rr('./router'));






// _______________________________________________ LEGACY ______________________________________________

// DO NOT TOUCH! just add handlers and event routes

// get object of all event handlers
// handlers MUST be a promise returning functions

//match events to handlers (via data.action send from frontend)
/*var get_site_router = require('./router');

// MUST RETURN A FUNCTION with 1 argument - socket !!
module.exports = function (socket) {

    var site        = socket ? socket.nsp.name : false;
        site        = site ? site.substring(1) : false; // '/sheo' -> 'sheo';
    var site_valid  = S[site] ? true : false;           // must be one of the running sites

    if(site && site_valid) {

        var handlers    = S[site].socket_handlers || {};
        var router      = get_site_router(handlers);

        console.log('IO CONNECTION ['+site+']');
        
        // create request environment for socket event request connection
        
        var SITE    = S[site];
        //var DB      = DBS[site];
        var DBN     = DBS[site];
        var Q       = false;
        
        // all connections will be accepted only after init connection (where parent request is retrieved succesfully)
        socket.on('INIT', (data) => {
            
        if(data.request_id) {
            
            //B.B =    DBS['sheo'].GET('requests', {id: data.request_id})
            B.B =    DB.GET('sheo', 'requests', {get: data.request_id})
                    .then((request) => {
            
                        Q   = request || false;
            
                        // checks if there is exactly 1 request, and if the request is not empty
                        if(Q && Q.id) {

                        // got parent request, now check if everything is alright, and attach site event handlers
                        if(SITE.name && DBN) {
                            
                            var recognized_events = [];
                            
                            for(event_ in router) {
                                
                                    if(M.util.is_function(router[event_])) {
                                    
                                        // attach event
                                        socket.on(event_, (data) => { 
                                        
                                            var result      = {ok: 0, data: {}, error: {id: '[se0]', err_text: 'Unknown error', err: ''}}; // se - site error
                                            var action      = data ? data.action : false; // for routing, ACTION == EVENT !!!

                                            if(action) {
                          
                                                // execute event handler
                                                B.C =   router[action](Q, socket, SITE, DB, data, result)
                                                        .then((result) => {

                                                            //console.log('Succesfully handled event ' + action + '. Result: ' + M.util.inspect(result));
                                                            socket.emit('SUCCESS', 'Succesfully handled event ' + action + '.');

                                                        }).catch((err) => {

                                                            //console.log('Failed to handle event ' + event + '. ERROR: ' + M.util.inspect(err));
                                                            socket.emit('ERROR', 'Failed to handle event ' + event_ + '. ERROR: ' + M.util.inspect(err));

                                                        });
                                                
                                            } else { socket.emit('ERROR', 'Failed to handle event. ERROR: Action not specified; action not found in emmitted data object.'); }
                                            
                                        });
                                    
                                    recognized_events.push(event_);
                                    
                                    }
                                
                            }
                            
                            // succesfully attached event handlers
                            socket.emit('INIT_RESULT', {ok: 1, text: 'Succesfully attached event handlers for: ', data: recognized_events});
                            
                        } else {
                            
                                var what_is_empty = '';
                                    what_is_empty+= SITE ? '' : 'SITE is empty, ';    
                                    what_is_empty+= DB ? '' : 'DB is empty, ';    
                                
                                socket.emit('INIT_RESULT', {ok: 0, text: 'Empty SITE or DB.', err: what_is_empty});
                            
                        }
                        
                        // no request found, no event handlers attached
                        } else { socket.emit('INIT_RESULT', {ok: 0, text: 'Request ' + data.request_id + ' was not found.', err: ''}); }
            
                    // either something went bad with retrieving request, OR some error occured inside event handler
                    }).catch((error) => { socket.emit('INIT_RESULT', {ok: 0, text: 'Error during retrieving request ' + data.request_id + ' or attaching event handlers to it.', err: M.util.inspect(error)}); });
        
            // request id wasnt found
            } else { socket.emit('INIT_RESULT', {ok: 0, text: 'Empty Request ID.', err: ''}); }
            
        });

    } else { socket.emit('INIT_RESULT', {ok: 0, text: '[e102] Missing or Invalid SITE NAME.', err: ''}); }

};*/
