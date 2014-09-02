
var Service = require("./Service")
var errorMessages = require("../errorMessages")
var db = require("../lib/db")
var Service = require("./Service")



var service = new Service()

/*
	ser_user object
	the service object for user
*/
var ser_user = {
	init: function(db) {
		this.db = db
		service.init({
			"db": db,
			"validErrorMessage": errorMessages.artistValidWrong
		})
		return this
	},
	register: function(user) {
		var promise = service.create(user)
		return promise
	},
	login: function(user) {
		var selector = {"name": user.get("name"), "password": user.get("password")}
		var promise = service.list(user, {
			"selector": selector
		})
		return promise
	},
	list: function(user) {
		var promise = service.list(user)
		return promise
	},
	update: function(user) {
		user.exclude({"_id": 1})
		var promise = service.update(user)
		return promise
	},
	delete: function(user) {
		var promise = service.delete(user)
		return promise
	}

}

module.exports = ser_user