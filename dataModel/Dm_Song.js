
var DataModel = require("./DataModel")


/*
	Dm_Song object
	the data model object for song
*/
var Dm_Song = DataModel.extend({
	default: {
		"_id": /^.+$/,
		"name": /^.+$/,
		"artistName": /^.*$/,
		"albumId": /^.+$/,
		"artistId": /^.+$/,
		"start": [/^\d+$/, "number"],
		"createTime": function() {
			return Date.now()
		},
		"modTime": function() {
			return Date.now()
		},
		"sortBy": function(val, self) {
			return self.mapSort(val)
		},
		"limit": function(val) {
			var num = parseInt(val)
			return num >= 0 ? num : 10
		}
	},
	default_create: {
		"name": 1,
		"artistName": 1,
		"albumId": 1,
		"artistId": 1,
		"createTime": 1,
		"modTime": 1
	},
	default_list: {
		"start": 1,
		"sortBy": 1,
		"limit": 1
	},
	default_listByAlbum: {
		"start": 1,
		"albumId": 1,
		"sortBy": 1,
		"limit": 1
	},
	default_listByArtist: {
		"start": 1,
		"artistId": 1,
		"sortBy": 1,
		"limit": 1
	},
	default_update: {
		"_id": 1,
		"name": 1,
		"artistName": 1,
		"modTime": 1,
		"albumId": 1,
		"artistId": 1
	},
	default_delete: {
		"_id": 1
	},

	/**/

	sortData: {
		"0": "name",
		"1": "createTime"
	},
	mapSort: function(num) {
		var res = this.sortData[num]
		return res ? res : this.sortData[0]
	}
})



module.exports = Dm_Song