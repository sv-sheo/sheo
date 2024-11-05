
module.exports = function(handlers, namespace) {
    
    // ACTION === EVENT - action name must be the same as event name !!!

    if(namespace === '/sheo') {

        return  {
            // action: handler function
            'ping': M._.get(handlers, 'soul.ping', false),
    
        };

    } else if(namespace === '/sheo_actilog') {
    
        return  {

                    // ACTILOG
                    'ping':                         M._.get(handlers, 'soul.ping', false),
                    'get_actilog_data':             M._.get(handlers, 'actilog.get_actilog_data', false),
                    'actilog_upsert_activity':      M._.get(handlers, 'actilog.upsert_activity', false),
                    'actilog_remove_activity':      M._.get(handlers, 'actilog.remove_activity', false),
                    'actilog_upsert_project':       M._.get(handlers, 'actilog.upsert_project', false),
                    'actilog_remove_project':       M._.get(handlers, 'actilog.remove_project', false),
                    'actilog_upsert_item':          M._.get(handlers, 'actilog.upsert_item', false), // categories + investors
                    'actilog_remove_item':          M._.get(handlers, 'actilog.remove_item', false), // categories + investors
                    'actilog_update_setting':       M._.get(handlers, 'actilog.update_setting', false),
                    'actilog_toggle_rights_link':   M._.get(handlers, 'actilog.toggle_rights_link', false),
                    'actilog_update_rights_souls':  M._.get(handlers, 'actilog.update_rights_souls', false),
                    'actilog_update_rights':        M._.get(handlers, 'actilog.update_rights', false),
            
                };

    } else { return {}; }
    
}