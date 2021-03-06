// set up ======================================================================
// get all the tools we need
var express  = require('express');
var path     = require('path');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var ConnectRoles = require('connect-roles');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

require('./config/passport')(passport); // pass passport for configuration


// Models
require('./app/models/waypoint')(mongoose);
require('./app/models/users')(mongoose);
require('./app/models/race')(mongoose);
require('./app/models/fillTestData')(mongoose);
// /Models



//roles:
var roles = require('./config/connect-roles')();
//roles


function handleError(req, res, statusCode, message){
    console.log();
    console.log('-------- Error handled --------');
    console.log('Request Params: ' + JSON.stringify(req.params));
    console.log('Request Body: ' + JSON.stringify(req.body));
    console.log('Response sent: Statuscode ' + statusCode + ', Message "' + message + '"');
    console.log('-------- /Error handled --------');
    res.status(statusCode);
    res.json(message);
};

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

//Routes
var routes = require('./routes/index');
var waypoints = require('./routes/waypoints')(handleError);
var races = require('./routes/races')(mongoose, roles, io, handleError);
var backend = require('./routes/backend')(roles, io);

// set up our express application
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: false }));


//app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(roles.middleware());

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.use('/races', races);
app.use('/waypoints', waypoints);
app.use('/backend', backend);

// launch ======================================================================
server.listen(port);
console.log('The magic happens on port ' + port);