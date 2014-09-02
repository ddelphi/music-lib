
var _ = require("lodash")
var db = require("../lib/db")
var errorMessages = require("../errorMessages")
var Service = require("./Service")



var service = new Service()

/*
	ser_album object
	the service object for album
*/
var ser_album = {
	init: function(db) {
		this.db = db
		service.init({
			"db": db,
			"validErrorMessage": errorMessages.albumValidWrong
		})
		return this
	},
	create: function(albumObject) {
		var promise = service.create(albumObject)
		return promise
	},
	list: function(albumObject) {
		var promise = service.list(albumObject)
		return promise
	},
	listByArtist: function(albumObject) {
		var promise = service.list(albumObject, {
			"selector": {"artistId": albumObject.get("artistId")}
		})
		return promise
	},
	update: function(albumObject) {
		albumObject.exclude({"_id": 1})
		var promise = service.update(albumObject)
		return promise
	},
	delete: function(albumObject) {
		var promise = service.delete(albumObject)
		return promise
	},

	/**/

	getAlbumInfo: function(albumIds, callback) {
		if (!_.isArray(albumIds)) {
			albumIds = [albumIds]
		}
		var selectors = []
		albumIds.forEach(function(id) {
			selectors.push({"_id": id})
		})
		this.db.query({$or: selectors}, function(err, doc) {
			// throw "pause"
			callback(err, doc)
		})
	}
}




module.exports = ser_album
