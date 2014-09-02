
var db = require("../lib/db")

/*
	ser_session object
	service object for session
*/
var ser_session = {
	init: function(cusDb) {
		this.db = cusDb || db.get("session")
	},
	get: function(token, callback) {
		this.db.query({"sid": token}, function(err, docs) {
			if (docs.length > 0) {
				callback(err, docs[0])
			} else {
				callback(err, docs)
			}
		})
	},
	set: function(token, doc, callback) {
		var self = this
		doc["sid"] = token
		this.db.update({"sid": token}, doc, {"upsert": true}, function(err, num) {
			callback(null, num)
		})
	},
	del: function(token, callback) {
		this.db.delete({"sid": token}, function(err, num) {
			callback(err, num)
		})
	}
}

module.exports = ser_session