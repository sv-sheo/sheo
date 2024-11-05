
exports.ping = async function(Q, socket, SITE, data = {}) {

	var result = {ok: 0, data: {}, error: null, id: '[ssspe1]', text: ''};

	try {

		result.ok = 1;
		result.text = 'Server was successfully shutdown.';

	} catch(error) { result = {...result, ok: 0, error, text: 'Failed to handle get_server_data - error: '+error.message}; }

	return result;
    
};