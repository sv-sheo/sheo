
// homepage and account management

exports.soul = {
    
    //      port 4337 (webpack dev server)
    dev:    require('./soul/dev.js'),
    prod:   require('./soul/prod.js')

}

exports.system = {
    
    //      port 4335 (webpack dev server)
    dev:    require('./system/dev.js'),
    prod:   require('./system/prod.js')

}
