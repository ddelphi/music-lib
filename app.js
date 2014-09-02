
var express = require("express")
var session = require("express-session")
var bodyParser = require("body-parser")
var cookieParser = require("cookie-parser")
var options = require("./options")
var CustomSession = require("./Session")
var CustomRouter = require("./router/router")
var routerDefines = require("./router/routerDefines")
var sessionPrepare = require("./sessionPrepare")

var db = require("./lib/db")
var ser_session = require("./service/ser_session")
var ser_user = require("./service/ser_user")
var ser_artist = require("./service/ser_artist")
var ser_album = require("./service/ser_album")
var ser_song = require("./service/ser_song")

var prepareDbSettings = require("./prepareDbSettings")
var privateParams = require("./privateParams")





// init databases

db.init()
var dbAction = options.app.env === "production"
	? "load"
	: "add"
db[dbAction]("acl")
db[dbAction]("session")
db[dbAction]("user")
db[dbAction]("artist")
db[dbAction]("album")
db[dbAction]("song")


ser_session.init(db.get("session"))
ser_user.init(db.get("user"))
ser_artist.init(db.get("artist"))
ser_album.init(db.get("album"))
ser_song.init(db.get("song"))

prepareDbSettings.setup(db)


/* main start */

// app
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cookieParser())

// session
var NedbStore = CustomSession(session)
app.use(session({
	"store": new NedbStore(),
	"key": "eid",
	"secret": "secret Of Session",
	"cookie": {
		"maxAge": 600000
	}
}))
app.use(sessionPrepare())

// static files
app.use("/example", express.static(__dirname + "/example"))

// router
var customRouter = new CustomRouter(express.Router())
customRouter.route(routerDefines)
customRouter.useBeforeRoute(privateParams())
app.use("/", customRouter.getRouter())

// end
app.use(function(req, res, next) {
	res.status(403)
	res.end()
})

// error
app.use(function(err, req, res, next) {
	// errorLogger(err, req, res)
	req.status(500)
	res.send("service has something wrong.")
})


var server = app.listen(3000, function() {
	console.info("listening on port %d", server.address().port)
})



module.exports = app