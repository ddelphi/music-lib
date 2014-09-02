
/*
	prepareDbSettings object
	to prepare some datas in advanced
*/
var prepareDbSettings = {
	setup: function(db) {
		this.superUser(db)
		this.uniqueField(db)
	},

	// prepare a superUser
	superUser: function(db) {
		var user = db.get("user")
		user.insert({
			"name": "admin",
			"password": "f353f2f89aebc88b3919dff77a61aade",		// md5 of "the pass" with salt
			"email": "admin@abc.com",
			"desc": "desc",
			"group": "admin"
		}, function(err) {
			if (err && err.message.indexOf("unique") === -1) {
				throw new Error("admin user not created. " + err.message)
			}
		})
	},

	// set databases' field to unique
	uniqueField: function(db) {
		var user = db.get("user")
		var artist = db.get("artist")
		var album = db.get("album")
		
		user.setUnique("name", function(err) {
			if (err) throw new Error("user db can not set unique.")
		})
		artist.setUnique("name")
		album.setUnique("name")
	}
}



module.exports = prepareDbSettings