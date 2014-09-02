
var when = require("when")
var _ = require("lodash")


/*
	Service class
	the base class for service object
*/
var Service = function(param) {
	this.init(param)
}
Service.prototype = {
	validErrorMessage: "dataModel valid error",

	init: function(param) {
		param = param || {}
		this.db = param.db
		this.validErrorMessage = param.validErrorMessage || this.validErrorMessage
	},
	// the main routine of the service
	routine: function(dmObject, errMsg, action) {
		var self = this
		var promise = when.promise(function(resolve, reject) {
			if (!dmObject.isValid()) {
				reject(errMsg)
			} else {
				action(resolve, reject)
			}
		})
		return promise
	},
	// default callback for reuse
	// will check the return value from 'update' and 'delete' methods
	defCallback: function(resolve, reject, err, data) {
		if (err) {
			reject(err)
		} else {
			if (_.isNumber(data) && data === 0) {
				reject(new Error("no data update or deleted."))
			} else {
				resolve(data)
			}
		}
	},

	/**/

	create: function(dm) {
		var self = this
		var promise = self.routine(dm, self.validErrorMessage, function(resolve, reject) {
			var data = dm.get()
			self.db.insert(data, self.defCallback.bind(this, resolve, reject))
		})
		return promise
	},
	update: function(dm, sel, options) {
		var self = this
		var promise = self.routine(dm, self.validErrorMessage, function(resolve, reject) {
			var data = dm.get()

			sel = _.isObject(sel) ? sel : {"_id": dm.get("_id")}
			options = _.isObject(options) ? options : {}
			self.db.update(sel, {"$set": data}, options, self.defCallback.bind(this, resolve, reject))
		})
		return promise
	},
	delete: function(dm, sel, options) {
		var self = this
		var promise = self.routine(dm, self.validErrorMessage, function(resolve, reject) {
			sel = _.isObject(sel) ? sel : {"_id": dm.get("_id")}
			options = _.isObject(options) ? options : {}
			self.db.delete(sel, options, self.defCallback.bind(this, resolve, reject))
		})
		return promise
	},
	list: function(dm, opt) {
		var self = this,
			opt = opt ? opt : {}
		var promise = self.routine(dm, self.validErrorMessage, function(resolve, reject) {
			var sel = opt["selector"] || {}
			var sortBy = {}
			var sortByField = dm.get("sortBy") || opt["sortBy"]
			sortBy[sortByField] = 1
			var start = dm.get("start") || opt["start"]
			var limit = dm.get("limit") || opt["limit"]

			var queryRecords = self.db.currentDb.find(sel)
			queryRecords = _.isObject(sortBy) ? queryRecords.sort(sortBy) : queryRecords
			queryRecords = _.isNumber(start) ? queryRecords.skip(start) : queryRecords
			queryRecords = _.isNumber(limit) ? queryRecords.limit(limit) : queryRecords

			queryRecords.exec(self.defCallback.bind(this, resolve, reject))
		})
		return promise
	},

	/**/

	extend: function(obj) {
		return _.extend(Object.create(this), obj)
	}
}


module.exports = Service