
var dictTools = require("./dictTools")
var aclOptions = require("../aclRules")

/*
	acl object
	currently using static acl data from aclOptions object
*/
var acl = {
	get: function(group, callback) {
		callback(aclOptions[group])
	},
	check: function(group, propArr, callback) {
		var data = aclOptions.hasOwnProperty(group) ? aclOptions[group].accessList : false
		var flag = false
		if (data) {
			flag = dictTools.get(data, propArr)
		}
		callback(flag)
	}
}

module.exports = acl