
var _ = require("lodash")
var Controller = require("./Controller")
var view_json = require("../view/view_json")

var Dm_Artist = require("../dataModel/Dm_Artist")
var ser_artist = require("../service/ser_artist")


/*
	con_artist object
	the controller object for artist
*/
var con_artist = Controller.extend({
	aclParentName: "artist",
	view: view_json,
	failRedirect: "",

	create: function(req) {
		var artist = new Dm_Artist(req.private.params, "create")
		var promise = ser_artist.create(artist)
		return promise
	},
	list: function(req) {
		var artist = new Dm_Artist(req.private.params, "list")
		var promise = ser_artist.list(artist)
		return promise
	},
	update: function(req) {
		var artist = new Dm_Artist(req.private.params, "update")
		var promise = ser_artist.update(artist)
		return promise
	},
	delete: function(req) {
		var artist = new Dm_Artist(req.private.params, "delete")
		var promise = ser_artist.delete(artist)
		return promise
	}

})

module.exports = con_artist