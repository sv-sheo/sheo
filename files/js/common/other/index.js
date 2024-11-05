

var log = require('../helpers/log');

exports.ready = new Promise((resolve, reject) => {
    
    document.onreadystatechange = function() {

        if(document.readyState === 'interactive') {
         
            log.time('DOM loaded.');

			var PRELOAD_DATA = PRELOAD_DATA || {}; // should be in HTML

			// get language
			var language    = PRELOAD_DATA.language ? PRELOAD_DATA.language : 'en';
				language    = {cz: 1, en: 1, de: 1}[language] ? language : 'en';
			var texts       = {

				cz: {header: 'NAČÍTÁM'},
				en: {header: 'LOADING'},
				de: {header: 'WIRD GELADEN'},

			}

			var t = texts[language];

            // add LOADING status to no_javascript
         /*   var DOM_nj_header           = document.getElementById('no_javascript_scroll_header');
            var DOM_nj_text             = document.getElementById('no_javascript_scroll_text');
                DOM_nj_header.innerHTML = t.header;
                DOM_nj_text.innerHTML   = '<div class="tc pd50_0"><img src="'+SERVER_DATA.HOST+'files/get/icons/loader2.gif" width="40" height="40" ></div>';
*/
            resolve(); // script declaring in html
            
        }
        
        if(document.readyState === 'complete') {
         
            log.time('PAGE loaded. (synchronous JS, CSS, IMAGES)');
            
        }
        
    };
    
});