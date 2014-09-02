
var view_json = {
	render: function(req, res, next, dict) {
		res.json(dict)
		next()
	}
}

module.exports = view_json