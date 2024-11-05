
exports.compile_account_data = function(Q, s) {
		
	Q.data.results      = {post: false, action: false};
	Q.data.results.post = Q.data.result ? Q.data.result : false; // result from previous action inner redirected

	if(Q.cookies.previous) { // previous ction result from POST

		Q.data.results.post         = JSON.parse(Q.cookies.previous);
		Q.data.results.post.type    = 'POST RESULT';
		s.cookie.delete('previous');

	}

}