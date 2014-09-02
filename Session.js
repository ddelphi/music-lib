
var ser_session = require("./service/ser_session")
var _ = require("lodash")


/*
	Session object
	the store object for express-session
*/
var Session = function(session) {

	var NedbStore = function(options) {
		options = options || {}
		this.prefix = options.prefix || ""

		session.Store.call(this, options)
	}

	NedbStore.prototype = Object.create(session.Store.prototype)

	NedbStore.prototype.get = function(sid, fn) {
		var self = this
		ser_session.get(this.prefix + sid, function(err, doc) {
			if (err) {
				return fn(err)
			}
			if (doc.length === 0) {
				return fn()
			}
			fn(null, doc)
		})
	}

	NedbStore.prototype.set = function(sid, doc, fn) {
		ser_session.set(this.prefix + sid, doc, function(err, num) {
			return err || !num ? fn(err || new Error("session not set.")) : fn()
		})
	}

	NedbStore.prototype.destory = function(sid, fn) {
		ser_session.del(this.prefix + sid, function(err, num) {
			return err || !num ? fn(err || new Error("session not deleted.")) : fn()
		})
	}

	// NedbStore.prototype.cusLimit = function(doc) {
	// 	var leaveOut = ["_id"]
	// 	leaveOut.forEach(function(val) {
	// 		delete doc[val]
	// 	})
	// 	return doc
	// }

	return NedbStore
}

module.exports = Session