
// MUST EXPORT AN ASYNC FUNCTION
// add custom middleware
// error will be caught outside ([e57]) (during site load)
module.exports = async function(SITE) {

    SITE.soul.other.register_partials(SITE.views.soul.partials);

    // sideload apps handlers - WARNING - will overwrite any potential handlers in SITE/handlers/actilog folder
    SITE.handlers.actilog = C.helper.force_require(require.resolve('../../apps/actilog/handlers'));

    // sideload apps views
    let actilog_views = await C.sites.async_recursive_load_views(M.path.join(SITE.config.root, './apps/actilog/views')); SITE.views.actilog = actilog_views.data;

    return {ok: 1, text: 'Middleware of site '+SITE.name+' loaded.', data: {}, error: null};

}