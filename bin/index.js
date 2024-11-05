
let rr = require.resolve;

// put together bin scripts

exports.router              = C.helper.force_require(rr('./router'));
exports.socket              = C.helper.force_require(rr('./socket'));
exports.soul                = C.helper.force_require(rr('./soul'));
exports.common             	= C.helper.force_require(rr('./common'));
exports.middleware          = C.helper.force_require(rr('./middleware'));

// APPS
exports.system 				= C.helper.force_require(rr('./system')); // Activity Logs
exports.actilog 			= C.helper.force_require(rr('../apps/actilog/bin')); // Activity Logs