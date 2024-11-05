
exports.forms = require('./forms');

exports.ready = new Promise((resolve, reject) => {
    
    document.onreadystatechange = function() {

        if(document.readyState === 'interactive') {
         
            M.log.time('DOM loaded.');

            resolve(); // script declaring in html
            
        }
        
        if(document.readyState === 'complete') {
         
            M.log.time('PAGE loaded. (synchronous JS, CSS, IMAGES)');
            
        }
        
    };
    
});