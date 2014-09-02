
/*
	access control list
*/
var aclRules = {
	"admin": {
		"group": "admin",
		"accessList": {
			"user": {
				"register": true,
				"login": true,
				"logout": true,
				"list": true,
				"update": true,
				"delete": true
			},
			"artist": {
				"create": true,
				"list": true,
				"update": true,
				"delete": true
			},
			"album": {
				"create": true,
				"list": true,
				"listByArtist": true,
				"update": true,
				"delete": true
			},
			"song": {
				"create": true,
				"list": true,
				"listByAlbum": true,
				"listByArtist": true,
				"update": true,
				"delete": true
			}
		}
	},
	"member": {
		"group": "member",
		"accessList": {
			"user": {
				"register": false,
				"login": false,
				"logout": true,
				"list": false,
				"update": false,
				"delete": false
			},
			"artist": {
				"create": true,
				"list": true,
				// "update": false,
				// "delete": false
			},
			"album": {
				"create": true,
				"list": true,
				"listByArtist": true,
				// "update": false,
				// "delete": false
			},
			"song": {
				"create": true,
				"list": true,
				"listByAlbum": true,
				"listByArtist": true,
				// "update": false,
				// "delete": false
			}

		}
	},
	"guest": {
		"group": "guest",
		"accessList": {
			"user": {
				"register": true,
				"login": true,
				"logout": true,
				"list": true
			},
			"artist": {
				// "create": false,
				"list": true,
				// "update": false,
				// "delete": false
			},
			"album": {
				// "create": false,
				"list": true,
				"listByArtist": true,
				// "update": false,
				// "delete": false
			},
			"song": {
				// "create": false,
				"list": true,
				"listByAlbum": true,
				"listByArtist": true,
				// "update": false,
				// "delete": false
			}

		}
	}
}

module.exports = aclRules