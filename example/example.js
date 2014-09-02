/*
user:
	register
	login
	logout
	
	list
	update
	delete

artist:
	create
	list
	update
	delete

album:
	create
	list
	listByArtist
	update
	delete

song:
	create
	list
	listByArtist
	listByAlbum
	update
	delete

*/


/*
	usage
	
	For testing propose, you can fill the "artistId" and "albumId" fields with
	a fake string
	
	But the "_id" field must be an actual _id in db, then it can work
	
	For 
*/

(function() {

var $ = window.jQuery



var assertTrue = function(expect, target, msg) {
	if (typeof msg === "string") {
		console.log("=====>", msg)
	}
	if (expect === target) {
		console.log("[TRUE]", expect, "||||", target)
	} else {
		console.error("[FALSE]", expect, "||||", target)
	}
}




var user = {
	run: function() {
		var userUrl = "/user"
		
		// register
		var regData = {
			"action": "register",
			"name": "jack",
			"password": "the pass",
			"email": "jack@email.com",
			"desc": "desc"
		}
		$.post(userUrl, regData, function(data, status) {
			assertTrue(data.status, "ok", "register ok")
			console.log("data:", JSON.stringify(data))
		})

		var loginData = {
			"action": "login",
			"name": "jack",
			"password": "the pass"
		}

		var logoutData = {
			"action": "logout"
		}
		
		// ********************
		// ## caution ##
		// below actions should be used as the admin has been logined
		// ********************
		
		this.loginAdmin()
	
		var listData = {
			"action": "list",
			"start": 0,
			"sortBy": 0,
			// "limit": 10
		}
		
		// the '_id' field should be fill by an actual _id from db
		var updateData = {
			"action": "update",
			"_id": null,
			"name": "name new",
			"email": "new@email.com",
			"password": "pass new",
			"desc": "desc new",
			"group": "admin"
		}
		
		// the '_id' field should be fill by an actual _id from db
		var deleteData = {
			"action": "delete",
			"_id": null
		}

	},
	loginAdmin: function() {
		var userUrl = "/user"
		
		var loginData = {
			"action": "login",
			"name": "admin",
			"password": "the pass"
		}
		$.post(userUrl, loginData, function(data) {
			if (data.status === "wrong") {
				throw new Error("admin login wrong.")
			} else {
				console.log("\n### admin login ok. ###\n")
			}
		})
	}
}

user.run()





var artist = {
	run: function() {
		var artistUrl = "/artist"

		// ## caution ##
		// below actions should be used as the admin has been logined
		// some actions can be used as the member group logined
		
		user.loginAdmin()
		this.createArtists()
		
		var createData = {
			"action": "create",
			"name": "star",
			"alias": "star one",
			"intro": "intro 1",
			"label": "label 1",
			"style": "style 1",
			"creator": "1"			// should be filled with actual user id in db
		}
		$.post(artistUrl, createData, function(data) {
			assertTrue(data.status, "ok", "artist create ok")
			console.log("data:", JSON.stringify(data))
		})

		var listData = {
			"action": "list",
			"start": 0,
			"sortBy": 0
		// "limit": 10
		}

		var updateData = {
			"action": "update",
			"_id": "",
			"name": "star new",
			"alias": "",
			"intro": "intro new",
			"label": "greenlet new",
			"style": "misc new",
			"creator": "1"			// should be filled with actual user id in db
		}
		
		var deleteData = {
			"action": "delete",
			"_id": null					// should be filled with actual user id in db
		}
	},
	
	/**/
	
	createArtists: function(n) {
		var self = this
		var artistUrl = "/artist"

		$.each(Array(n), function(k, v) {
			var num = k + 1
			var createData = {
					"action": "create",
					"name": "star " + num,
					"alias": "alias " + num,
					"intro": "intro " + num,
					"label": "label " + num,
					"style": "style " + num,
					"creator": num > 11 ? "2" : "1"
			}
			$.post(artistUrl, createData, function(data) {
				if (data.status === "wrong") {
					throw new Error("create artists error.")
				}
				console.log("\n### create artists okay. ###\n")
			})
		})
	}
}

artist.run()





var album = {
	run: function() {
		var albumUrl = "/album"

		// ## caution ##
		// below actions should be used as the admin has been logined
		// some actions can be used as the member group logined
		
		user.loginAdmin()


		var createData = {
			"action": "create",
			"name": "album 1",
			"desc": "desc 1",
			"label": "label 1",
			"style": "style 1",
			"publish": "publish 1",
			"artistId": "1"				// should be filled with actual user id in db
		}
		$.post(albumUrl, createData, function(data) {
			assertTrue(data.status, "ok", "album create ok")
			console.log("data:", JSON.stringify(data))
		})


		this.createAlbums()


		var listData = {
			"action": "list",
			"start": 0,
			"sortBy": 0,
			// "limit": 8
		}

		var listByArtistData = {
			"action": "listByArtist",
			"start": 0,
			"sortBy": 0,
			// "limit": 3,
			"artistId": "1"			// should be filled with actual user id in db
		}

		var updateData = {
			"action": "update",
			"_id": null,				// should be filled with actual user id in db
			"name": "album 1 new",
			"desc": "desc 1 new",
			"label": "label 1 new",
			"style": "style 1 new",
			"publish": "publish 1 new",
			"artistId": "1"			// should be filled with actual user id in db
		}

		var deleteData = {
			"action": "delete",
			"_id": null					// should be filled with actual user id in db
		}

	},

	/**/

	createAlbums: function() {
		// throw new Error("please implement this method according to createArtists() method to test the list action.")
	}
}

album.run()





var song = {
	run: function() {
		var songUrl = "/song"

		// ## caution ##
		// below actions should be used as the admin has been logined
		// some actions can be used as the member group logined

		user.loginAdmin()



		var createData = {
			"action": "create",
			"name": "song 1",
			"artistName": "artist name 1",
			"albumId": "1",					// should be filled with actual user id in db
			"artistId": "1"					// should be filled with actual user id in db
		}
		$.post(songUrl, createData, function(data) {
			assertTrue(data.status, "ok", "song create ok")
			console.log("data:", JSON.stringify(data))
		})


		this.createSongs()


		var listData = {
			"action": "list",
			"start": 0,
			"sortBy": 0
			// "limit": 5
		}

		var listByAlbumData = {
			"action": "listByAlbum",
			"start": 0,
			"sortBy": 0,
			"albumId": "1",				// should be filled with actual user id in db
			// "limit": 5
		}

		var listByArtistData = {
			"action": "listByArtist",
			"start": 0,
			"sortBy": 0,
			"artistId": "1",				// should be filled with actual user id in db
			// "limit": 8
		}

		var updateData = {
			"action": "update",
			"_id": null,					// should be filled with actual user id in db
			"name": "album 1 new",
			"artistName": "artist name 1 new",
			"albumId": "1",					// should be filled with actual user id in db
			"artistId": "1"					// should be filled with actual user id in db
		}

		var deleteData = {
			"action": "delete",
			"_id": null						// should be filled with actual user id in db
		}
	},

	/**/

	createSongs: function() {
		// throw new Error("please implement this method according to createArtists() method.")
	}
}

// song.run()


})()