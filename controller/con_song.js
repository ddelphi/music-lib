
var _ = require("lodash")
var when = require("when")
var async = require("async")
var Controller = require("./Controller")
var view_json = require("../view/view_json")

var Dm_Song = require("../dataModel/Dm_Song")
var ser_song = require("../service/ser_song")
var ser_artist = require("../service/ser_artist")
var ser_album = require("../service/ser_album")



/*
	con_song object
	the controller object for song
*/
var con_song = Controller.extend({
	aclParentName: "song",
	view: view_json,
	failRedirect: "",

	create: function(req) {
		var song = new Dm_Song(req.private.params, "create")
		var promise = ser_song.create(song)
		return promise
	},
	list: function(req) {
		var song = new Dm_Song(req.private.params, "list")
		var promise = ser_song.list(song)
		return this.listAction(promise)
	},
	listByAlbum: function(req) {
		var song = new Dm_Song(req.private.params, "listByAlbum")
		var promise = ser_song.listByAlbum(song)
		return this.listAction(promise, "album")
	},
	listByArtist: function(req) {
		var song = new Dm_Song(req.private.params, "listByArtist")
		var promise = ser_song.listByArtist(song)
		return this.listAction(promise, "artist")
	},
	update: function(req) {
		var song = new Dm_Song(req.private.params, "update")
		var promise = ser_song.update(song)
		return promise
	},
	delete: function(req) {
		var song = new Dm_Song(req.private.params, "delete")
		var promise = ser_song.delete(song)
		return promise
	},

	/**/

	listAction: function(promise, byWhat) {
		var self = this
		return when.promise(function(resolve, reject) {
			promise.then(function(data) {
				async.parallel([function(callback) {
					// get artist info
					var artistIds
					if (byWhat) {
						artistIds = data[0].artistId
					} else {
						artistIds = []
						for (var i = data.length - 1; i >= 0; i--) {
							artistIds.push(data[i].artistId)
						}
					}
					ser_artist.getArtistInfo(artistIds, self.setArtistInfo.bind(null, callback, data))
				}, function(callback) {
					// get album info
					var albumIds
					if (byWhat == "album") {
						albumIds = data[0].albumId
					} else {
						albumIds = []
						for (var i = data.length - 1; i >= 0; i--) {
							albumIds.push(data[i].albumId)
						}
					}
					ser_album.getAlbumInfo(albumIds, self.setAlbumInfo.bind(null, callback, data))
				}], function(err, res) {
					resolve(data)
				})
			}, reject)
		})
	},
	setAlbumInfo: function(callback, data, err, docs) {
		if (!err) {
			_.map(data, function(val) {
				val["album"] = _.find(docs, function(doc) {
					return doc._id === val.albumId
				})
			})
		}
		callback(null, data)
	},
	setArtistInfo: function(callback, data, err, docs) {
		if (!err) {
			_.map(data, function(val) {
				val["artist"] = _.find(docs, function(doc) {
					return doc._id === val.artistId
				})
			})
		}
		callback(null, data)
	}

})

module.exports = con_song