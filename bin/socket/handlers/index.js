
let rr = require.resolve;

exports.users 		= C.helper.force_require(rr('./users'));
exports.soul 		= C.helper.force_require(rr('./soul'));
exports.actilog 	= C.helper.force_require(rr('./../../../apps/actilog/socket/handlers'));