
let rr = require.resolve;

exports.pre		= C.helper.force_require(rr('./pre'));
exports.other   = C.helper.force_require(rr('./other'));