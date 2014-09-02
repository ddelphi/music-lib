
var _ = require("lodash")


var privateParams = function() {
	return function(req, res) {
		req.private = req.private || {}
		req.private.params = _.extend({}, req.query, req.params, req.body)
	}
}

module.exports = privateParams