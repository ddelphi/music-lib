
var _ = require("lodash")
var errorMessages = require("../errorMessages")
var Service = require("./Service")



var service = new Service()

/*
	ser_artist object
	the service object for artist
*/
var ser_artist = {
	init: function(db) {
		this.db = db
		service.init({
			"db": db,
			"validErrorMessage": errorMessages.artistValidWrong
		})
		return this
	},
	create: function(artistObject) {
		var promise = service.create(artistObject)
		return promise
	},
	list: function(artistObject) {
		var promise = service.list(artistObject)
		return promise
	},
	update: function(artistObject) {
		artistObject.exclude({"_id": 1})
		var promise = service.update(artistObject)
		return promise
	},
	delete: function(artistObject) {
		var promise = service.delete(artistObject)
		return promise
	},

	/**/

	getArtistInfo: function(artistIds, callback) {
		if (!_.isArray(artistIds)) {
			artistIds = [artistIds]
		}
		var selectors = []
		artistIds.forEach(function(id) {
			selectors.push({"_id": id})
		})
		this.db.query({$or: selectors}, function(err, doc) {
			// throw "pause"
			callback(err, doc)
		})
	}
}



module.exports = ser_artist
