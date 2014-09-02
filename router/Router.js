
var _ = require("lodash")


/*
	Router Object
	the wrapper of the express router
	providing a little more convenience for routing
*/
var Router = function(expressRouter) {
	this.init(expressRouter)
}
Router.prototype = {
	init: function(expressRouter) {
		this.default = {
			"executionName": "execute",
			"controllerPath": "../controller",
			"viewPath": "../view",
			"expressRouter": expressRouter
		}
		this.actions = []
		this.controllers = []
	},
	set: function(dict) {
		_.extend(this.default, dict)
	},
	setExpress: function(express) {
		this.default.expressRouter = express.Router()
	},
	setControllerPath: function(path) {
		this.default.controllerPath = path
	},
	setViewPath: function(path) {
		this.default.viewPath = path
	},
	setExecutionName: function(name) {
		this.default.executionName = name
	},

	/**/

	get: function(pat, controller, view) {
		this.default.expressRouter.get(pat, this._route.bind(this, controller, view))
	},
	post: function(pat, controller, view) {
		this.default.expressRouter.post(pat, this._route.bind(this, controller, view))
	},
	put: function(pat, controller, view) {
		this.default.expressRouter.put(pat, this._route.bind(this, controller, view))
	},
	update: function(pat, controller, view) {
		this.default.expressRouter.update(pat, this._route.bind(this, controller, view))
	},

	/**/
	
	route: function(list) {
		var self = this,
			method, pat, con, view
		list.forEach(function(item) {
			method = item[0]
			pat = item[1]
			con = item[2]
			view = item[3]
			if (!_.isFunction(self[method])) {
				throw new Error("router method not exists.")
			}
			self[method](pat, con, view)
		})
	},
	_route: function(con, view, req, res, next) {
		var conPath = this.constructControllerPath(con)
		var con = require(conPath)
		var execName = this.default.executionName

		this.constructPrivate(req, view)
		this.doBeforeRoute(req, res)
		con[execName](req, res, next)
	},
	constructControllerPath: function(conName) {
		var conPath = this.default.controllerPath.replace(/\/$/, "") + "/"
		return conPath + conName
	},
	constructPrivate: function(req, viewName) {
		if (!_.isObject(req.private)) {
			req.private = {}
		}
		req.private.view = this.constructView(viewName)
	},
	constructView: function(viewName) {
		var conPath = this.default.viewPath.replace(/\/$/, "") + "/"
		return conPath + viewName
	},

	/**/

	useBeforeRoute: function(fn) {
		if (!_.isFunction(fn)) return false
		this.actions.push(fn)
	},
	doBeforeRoute: function(req, res) {
		for (var i = 0; i < this.actions.length; i++) {
			this.actions[i](req, res)
		}
	},

	/**/

	use: function() {
		var ro = this.default.expressRouter
		ro.use.apply(ro, Array.prototype.slice.call(arguments))
	},
	getRouter: function() {
		return this.default.expressRouter
	}
}


module.exports = Router