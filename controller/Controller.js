
var _ = require("lodash")
var acl = require("../lib/acl")
var logger = require("../lib/logger")


/*
	Controller class
	the base controller methods for controller object
*/
var Controller = {
	// aclParentName is for acl check
	aclParentName: "",
	view: null,
	failRedirect: "",
	
	/*
		the constructInput() and constructOutput() methods
		are used for constrain the input and the output data
	*/

	constructInput: function(dict) {
		return dict
	},
	constructOutput: function(type, extra) {
		var dict = {
			"status": type,
			"result": null
		}
		if (toString.call(extra).indexOf("Error") > 7) {
			dict.result = extra.message
		} else if (_.isObject(extra)) {
			dict.result = extra
		} else {
			dict.result = { "message": extra }
		}
		return dict
	},

	/*
		execute() method is the main method for
		the whole controller
	*/

	execute: function(req, res, next) {
		var self = this
		var method = req.private.params["action"]
		
		self.checkAcl(req, method, function(aclFlag) {
			if (!aclFlag) {
				self.fail(req, res, next, "acl fail")
			} else {
				self.doAction(method, req, res, next)
			}
		})
	},
	// check the value from key path 'category.action' for access control limitation
	// expect return value from acl.check() will be Boolean type and 'self'
	checkAcl: function(req, method, callback) {
		if (!_.isString(method) || !_.isString(req.session.group)) { return callback(false) }

		var self = this
		var prop = [this.aclParentName, method]
		acl.check(req.session.group, prop, function(flag) {
			if (_.isBoolean(flag)) {
				callback(flag)
			} else if (flag === "self") {
				self.checkAclSelf(callback)
			} else {
				callback(false)
			}
		})
	},
	// for 'self' limit, mostly used for matching the user id
	checkAclSelf: function(callback) {
		throw new Error("checkAclSelf() not implemented.")
	},
	doAction: function(method, req, res, next) {
		if (!this.hasOwnProperty(method)) return false

		var promise = this[method](req, res)
		promise.then(this.render.bind(this, req, res, next), this.fail.bind(this, req, res, next))
	},

	/**/
	
	fail: function(req, res, next, data) {
		var status = this.constructOutput("wrong", data)
		this.view.render(req, res, next, status)
	},
	render: function(req, res, next, dict) {
		var status = this.constructOutput("ok", dict)
		this.view.render(req, res, next, status)
	},
	extend: function(obj) {
		return _.extend(Object.create(this), obj)
	}
}

module.exports = Controller