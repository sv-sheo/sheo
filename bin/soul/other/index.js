

// exports.test = require('./test');

exports.register_partials = function(partials = []) {
    
    var partials_to_load = ['login', 'signin', 'app_list', 'app_block', 'sidebar', 'footer', 'js_data']; 

    partials_to_load.forEach(function(partial) {
        
        if(partials[partial]) M.handlebars.registerPartial('soul_'+partial, partials[partial]); // in handlebars the partials will be accessible with the "soul_" prefix (app name)

    });
    
}

// used in signin_process - after creating new soul
exports.create_new_actilog = async function(SITE, new_soul) {

    if(new_soul && new_soul.id) {

        // get last soul
        let DB_app          = await DB.GET(SITE.DB, 'apps', {filter: {name: 'actilog'}, format: 'single'}).catch((err) => Promise.resolve({DB_ERROR: 1, err: err}));
        let app             = (DB_app && DB_app.id) ? DB_app : {id: 0};
        let query 			= {order_by: ['id', 'desc', true], limit: 1, format: 'single'};

        let last_actilog	= await DB.GET(SITE.DB, 'actilog', query).catch((err) => Promise.resolve({DB_ERROR: 1, err: err}));
        let new_id 			= (last_actilog && last_actilog.id) ? (last_actilog.id + 1) : 1;
        let new_actilog 	= {id: new_id, soul_id: new_soul.id, app_id: app.id, rights: {read: 'private', write: 'private'}};

        if(app.id) {

            var insert 		= await DB.SET(SITE.DB, 'actilog', new_actilog).catch((err) => Promise.resolve({DB_ERROR: 1, err: err}));

            if( insert && !insert.DB_ERROR ) {

                let last_settings	= await DB.GET(SITE.DB, 'actilog_settings', query).catch((err) => Promise.resolve({DB_ERROR: 1, err: err}));
                let new_sid 		= (last_settings && last_settings.id) ? (last_settings.id + 1) : 1;
                let new_settings 	= {id: new_sid, actilog_id: new_id, other: {download_years:2}, units:{currency:'USD',time:'h'}, values:{price_decimals:0,time_spent_decimals:2} };

                var insert_settings = await DB.SET(SITE.DB, 'actilog_settings', new_settings).catch((err) => Promise.resolve({DB_ERROR: 1, err: err}));

                return {ok: 1, error: '', data: new_actilog};

            } else { return {ok: 0, error: 'Couldn\'t create actilog - DB error: '+insert.err, data: {}}; }

        } else { return {ok: 0, error: 'Couldn\'t create actilog - invalid app.', data: {}}; }

    } else { return {ok: 0, error: 'Couldn\'t create actilog - invalid soul.', data: {}}; }

}

// get soul apps and its data
exports.get_soul_apps = async function(Q) {

    var apps = {};
    let SITE = S[Q.site];

    if(Q.data.soul && Q.data.soul.id) {

        // ACTILOG
        apps.actilog = await DB.GET(SITE.DB, 'actilog', {filter: {soul_id: Q.data.soul.id}, format: 'single'}).catch(err=>null);
                        // {id, app_id, soul_id, rights}

        if(apps.actilog && apps.actilog.id) {

            apps.actilog.data = {};
            apps.actilog.data.counts = {};
            apps.actilog.data.counts.activities     = await DB.db(SITE.DB.NAME).table('actilog_activities').count(function(act) { return act('actilog_id').eq(apps.actilog.id); }).run(SITE.DB.CONNECTION);
            apps.actilog.data.counts.projects       = await DB.db(SITE.DB.NAME).table('actilog_projects').count(function(act) { return act('actilog_id').eq(apps.actilog.id); }).run(SITE.DB.CONNECTION);

            apps.actilog.name       = 'actilog';
            apps.actilog.header     = 'ACTILOG';
            apps.actilog.title      = 'Activity log';
            apps.actilog.description= 'Simple app for logging your activities.<br><br>'+(apps.actilog.data.counts.projects || 0)+' projects<br>'+(apps.actilog.data.counts.activities || 0)+' activities';
            apps.actilog.status     = 'DEPLOYED';
            apps.actilog.available  = 1;


        } else { delete apps.actilog; }

    }

    return apps;

}

// get soul apps and its data
exports.get_home_apps = async function(Q) {

    var apps = {};
    var SITE = S[Q.site];

    // ACTILOG - if soul is logged in, get his actilog, otherwise get actilog 1
    if(Q.data.soul && Q.data.soul.id) {

        apps.actilog = await DB.GET(SITE.DB, 'actilog', {filter: {soul_id: Q.data.soul.id}, format: 'single'}).catch(err=>null); // {id, app_id, soul_id, rights}

    } else { apps.actilog = await DB.GET(SITE.DB, 'actilog', {get: 1}).catch(err=>null) }; // {id, app_id, soul_id, rights}}

    if(apps.actilog && apps.actilog.id) {

        apps.actilog.data = {};
        apps.actilog.data.counts = {};
        apps.actilog.data.counts.actilogs       = await DB.db(SITE.DB.NAME).table('actilog').count().run(SITE.DB.CONNECTION); // count all actilogs
        apps.actilog.data.counts.activities     = await DB.db(SITE.DB.NAME).table('actilog_activities').count().run(SITE.DB.CONNECTION);

        apps.actilog.name       = 'actilog';
        apps.actilog.header     = 'ACTILOG';
        apps.actilog.title      = 'Activity log';
        apps.actilog.description= 'Simple app for logging your activities.<br><br>'+(apps.actilog.data.counts.actilogs || 0)+' actilogs<br>'+(apps.actilog.data.counts.activities || 0)+' activities';
        apps.actilog.status     = 'DEPLOYED';
        apps.actilog.available  = 1;


    } else { delete apps.actilog; }

    apps.mist =     { name: 'mist',   header: 'MIST',       title: 'Media list',      status: 'IN DEVELOPMENT',   available: 0, description: 'Organize your books, series, anime, games etc...'};
    apps.trackbit = { name: 'trackbit',header:'TRACKBIT',   title: 'Habbit tracker',  status: 'SUGGESTED',        available: 0, description: 'Probably not gonna help either, but why not try it?'};
    apps.budget =   { name: 'budget', header: 'BUDGET',     title: 'Finance manager', status: 'EXPECTED',         available: 0, description: 'An app for managing<br>your finances.'};
    apps.todo =     { name: 'todo',   header: 'TODO',       title: 'To Do App',       status: 'EXPECTED',         available: 0, description: 'You know what<br>a To Do app is.'};
    apps.life =     { name: 'life',   header: 'LIFE',       title: 'Life App',        status: 'EXPECTED',         available: 0, description: 'Everything can be expressed in numbers. Try it with your life.'};

    return apps;

}