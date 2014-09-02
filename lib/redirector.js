
/*
	redirector object
	
*/
var redirector = {
	controllerPath: "../controller/",

	redirect: function(req, res, next, path) {
		if (this.isUrl(path)) {
			this.redirectToUrl(req, res, next, path)
		} else {
			this.redirectToController(req, res, next, path)
		}
	},
	redirectToUrl: function(req, res, next, path) {
		// todo
	},
	redirectToController: function(req, res, next, path) {
		var conPath = this.constructControllerPath(path)
		var con = require(conPath) || {}
		if (!_.isFunction(con.execute)) throw new Error("redirector controller not found.")
		con.execute(req, res, next)
	},

	/**/

	isUrl: function(path) {
		return path.indexOf("/") > -1 ? true : false
	},
	constructControllerPath: function(path) {
		return this.controllerPath + path
	}
}

module.exports = redirector