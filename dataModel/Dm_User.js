
var DataModel = require("./DataModel")
var crypto = require("crypto")
var _ = require("lodash")


/*
	Dm_User object
	the data model object for user
*/
var Dm_User = DataModel.extend({
	default: {
		"_id": [/^\w+$/, "string"],
		"name": [/^.+$/, "string"],
		"email": [/^\w+@[\w\.]+$/, "string"],
		"desc": [/^[\s\S]*$/, "string"],
		"start": [/^.+$/, "number"],
		"password": function(val, self) {
			return self.check_password(val, self)
		},
		"group": function(val, self) {
			if (self.defaultName === "default_update") {
				return val
			}
			return "member"
		},
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
	default_register: {
		"name": 1,
		"email": 1,
		"password": 1,
		"desc": 1,
		"group": 1,
		"createTime": 1,
		"modTime": 1
	},
	default_login: {
		"name": 1,
		"password": 1
	},
	default_list: {
		"start": 1,
		"sortBy": 1,
		"limit": 1
	},
	default_update: {
		"_id": 1,
		"name": 1,
		"email": 1,
		"password": 1,
		"desc": 1,
		"group": 1,
		"modTime": 1
	},
	default_delete: {
		"_id": 1
	},

	/**/

	check_password: function(val, self) {
		if (!_.isString(val) || val.length > 20) {
			self.validFlag = false
			return
		}
		var salt = "-some salt for password"
		var finPass = val + salt
		var fin = crypto
			.createHash("md5")
			.update(finPass, "utf8")
			.digest("hex")
		return fin
	},
	sortData: {
		"0": "name",
		"1": "createTime"
	},
	mapSort: function(num) {
		var res = this.sortData[num]
		return res ? res : this.sortData[0]
	}

})


module.exports = Dm_User