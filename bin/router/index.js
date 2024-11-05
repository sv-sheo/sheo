
let rr = require.resolve;

let routes 				= C.helper.force_require(rr('./routes'));
	routes['actilog']	= C.helper.force_require(rr('../../apps/actilog/bin/routes')); // routes for subdomain actilog

exports.get_routes = function(Q) {

	// first process sub-domains from host: app.site.com -> [0: "com", 1: "site", 2: "app"]
	let host_split 					= Q.host.split('.').reverse();
	let route_group 				= "sheo"; 	// ... default routes to use if there is no sub domain
	let route_groups_by_sub_domains = { 			// should contain all unique sub-domains from SITE.config.hosts 

		'www': 			'sheo',
		'actilog': 		'actilog',

	};

	// sub-domains must be added to C:\Windows\System32\drivers\etc\hosts as well
	
	// using only 3rd level sub-domains
	if(host_split.length === 3) {

		let sub_domain 	= host_split[2];
			route_group	= route_groups_by_sub_domains[sub_domain] || "sheo"; // make sure the route_group is also in routes

	}

	return routes[route_group] || {};

}