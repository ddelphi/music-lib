
var _ = require("lodash")
var when = require("when")
var Controller = require("./Controller")
var view_json = require("../view/view_json")

var Dm_User = require("../dataModel/Dm_User")
var ser_user = require("../service/ser_user")



/*
	con_user object
	the controller object for user
*/
var con_user = Controller.extend({
	aclParentName: "user",
	view: view_json,
	failRedirect: "",

	register: function(req) {
		var user = new Dm_User(req.private.params, "register")
		var promise = ser_user.register(user)
		return promise
	},
	login: function(req) {
		var self = this
		var user = new Dm_User(req.private.params, "login")
		var promise = ser_user.login(user)
		return when.promise(function(resolve, reject) {
			promise.then(function(doc) {
				if (doc.length === 0) {
					reject("login fail")
				} else {
					var data = doc[0]
					self.sessionAdd(req, data)
					resolve(data)
				}
			}, reject)
		})
	},
	list: function(req) {
		var user = new Dm_User(req.private.params, "list")
		var promise = ser_user.list(user)
		return promise
	},
	update: function(req) {
		var user = new Dm_User(req.private.params, "update")
		var promise = ser_user.update(user)
		return promise
	},
	delete: function(req) {
		var user = new Dm_User(req.private.params, "delete")
		var promise = ser_user.delete(user)
		return promise
	},
	logout: function(req) {
		var self = this
		return when.promise(function(resolve, reject) {
			if (req.session.login === 1) {
				self.sessionDel(req)
				resolve()
			} else {
				reject("user not yet login.")
			}
		})
	},
	sessionAdd: function(req, doc) {
		var time = 300000
		req.session.userName = doc.name
		req.session.group = doc.group
		req.session.login = 1
		// req.session.cookie.expires = new Date(Date.now() + time)
		req.session.cookie.maxAge = time
	},
	sessionDel: function(req) {
		delete req.session.userName
		delete req.session.group
		delete req.session.login 
	},

	/**/

	limit: function(dict) {
		// todo
		return dict
	}
})

module.exports = con_user