
var DataModel = require("./DataModel")


/*
	Dm_Album object
	the data model object for album
*/
var Dm_Album = DataModel.extend({
	default: {
		"_id": [/^.+$/, "string"],
		"name": [/^.+$/, "string"],
		"desc": [/^[\s\S]*$/, "string"],
		"label": [/^.*$/, "string"],
		"style": [/^.*$/, "string"],
		"publish": [/^.*$/, "string"],
		"artistId": [/^.+$/, "string"],
		"start": [/^.+$/, "number"],
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
		"desc": 1,
		"label": 1,
		"style": 1,
		"publish": 1,
		"artistId": 1,
		"createTime": 1,
		"modTime": 1
	},
	default_list: {
		"start": 1,
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
		"desc": 1,
		"label": 1,
		"style": 1,
		"publish": 1,
		"artistId": 1,
		"modTime": 1
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




module.exports = Dm_Album