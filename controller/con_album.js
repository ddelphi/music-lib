
var _ = require("lodash")
var when = require("when")
var acl = require("../lib/acl")
var logger = require("../lib/logger")
var options = require("../options")
var Controller = require("./Controller")

var view_json = require("../view/view_json")
var Dm_Album = require("../dataModel/Dm_Album")
var ser_album = require("../service/ser_album")
var ser_artist = require("../service/ser_artist")



/*
	con_album object
	the controller object for album
*/
var con_album = Controller.extend({
	aclParentName: "album",
	view: view_json,
	failRedirect: "",

	create: function(req) {
		var album = new Dm_Album(req.private.params, "create")
		var promise = ser_album.create(album)
		return promise
	},
	list: function(req) {
		var self = this
		var album = new Dm_Album(req.private.params, "list")
		var promise = ser_album.list(album)
		return when.promise(function(resolve, reject) {
			promise.then(function(data) {
				var artistIds = []
				for (var i = data.length - 1; i >= 0; i--) {
					artistIds.push(data[i].artistId)
				}
				ser_artist.getArtistInfo(artistIds, self.setArtistInfo.bind(null, resolve, data))
			}, reject)
		})
	},
	listByArtist: function(req) {
		var self = this
		var album = new Dm_Album(req.private.params, "listByArtist")
		var promise = ser_album.listByArtist(album)
		return when.promise(function(resolve, reject) {
			promise.then(function(data) {
				var artistId = data[0].artistId
				ser_artist.getArtistInfo(artistId, self.setArtistInfo.bind(null, resolve, data))
			}, reject)
		})
	},
	update: function(req) {
		var album = new Dm_Album(req.private.params, "update")
		var promise = ser_album.update(album)
		return promise
	},
	delete: function(req) {
		var album = new Dm_Album(req.private.params, "delete")
		var promise = ser_album.delete(album)
		return promise
	},

	/**/

	setArtistInfo: function(resolve, data, err, docs) {
		if (!err) {
			_.map(data, function(val, i) {
				val.artist = _.find(docs, function(doc) {
					return doc._id == val.artistId
				})
			})
		}
		resolve(data)
	}

})

module.exports = con_album