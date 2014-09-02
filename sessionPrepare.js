
var _ = require("lodash")


/*
	sessionPrepare object
	an express middleware for dealing the guest user
*/
var sessionPrepare = function() {
	return function(req, res, next) {
		if (!req.session.group) {
			req.session.group = "guest"
		}
		next()
	}
}


module.exports = sessionPrepare