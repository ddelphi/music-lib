
var _ = require("lodash")
var db = require("../lib/db")
var errorMessages = require("../errorMessages")
var Service = require("./Service")

var service = new Service()

/*
	ser_song object
	the service object for song
*/
var ser_song = {
	init: function(db) {
		this.db = db
		service.init({
			"db": db,
			"validErrorMessage": errorMessages.songValidWrong
		})
		return this
	},
	create: function(songObject) {
		var promise = service.create(songObject)
		return promise
	},
	list: function(songObject) {
		var promise = service.list(songObject)
		return promise
	},
	listByAlbum: function(songObject) {
		var promise = service.list(songObject, {
			"selector": {"albumId": songObject.get("albumId")}
		})
		return promise
	},
	listByArtist: function(songObject) {
		var promise = service.list(songObject, {
			"selector": {"artistId": songObject.get("artistId")}
		})
		return promise
	},
	update: function(songObject) {
		songObject.exclude({"_id": 1})
		var promise = service.update(songObject)
		return promise
	},
	delete: function(songObject) {
		var promise = service.delete(songObject)
		return promise
	}
}



module.exports = ser_song
