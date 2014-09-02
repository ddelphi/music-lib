
var nedb = require("nedb")


/*
	db object
	a wrapper object for nedb database
*/
var db = {
	init: function() {
		this.db = {}
		this.path = "./dbs/"
		this.currentDb = null
		return this
	},
	add: function(name) {
		if (this.db.hasOwnProperty(name)) return
		var newDb = new nedb()
		this.db[name] = Object.create(this).set(newDb)
		return this
	},
	load: function(name) {
		if (this.db.hasOwnProperty(name)) return
		var newDb = new nedb({
			"filename": this.path + name,
			"autoload": true
		})
		this.db[name] = Object.create(this).set(newDb)
		return this
	},
	get: function(name) {
		if (!this.db.hasOwnProperty(name)) return null
		return this.db[name]
	},
	set: function(db) {
		this.currentDb = db
		return this
	},

	/**/

	_exec: function(actionName, originArg) {
		var args = Array.prototype.slice.call(originArg)
		return this.currentDb[actionName].apply(this.currentDb, args)
	},
	query: function() {
		return this._exec("find", arguments)
	},
	insert: function() {
		this._exec("insert", arguments)
	},
	update: function() {
		this._exec("update", arguments)
	},
	delete: function() {
		this._exec("remove", arguments)
	},
	setUnique: function(fieldName, callback) {
		callback = callback || function() {}
		this.currentDb.ensureIndex({"fieldName": fieldName, "unique": true}, callback)
	}
}

module.exports = db