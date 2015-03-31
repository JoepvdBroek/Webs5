var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var path = require('path');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('../config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

app.use(function(req,res,next){    
    res.header('Access-Control-Allow-Origin', 'http://localhost');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

require('../config/passport')(passport); // pass passport for configuration

// Models
var Waypoint = require('../app/models/waypoint')(mongoose);
var User = require('../app/models/users')(mongoose);
var Race = require('../app/models/race')(mongoose);
// /Models

//roles:
var roles = require('../config/connect-roles')();

//error handler
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

//Routes
var routes = require('../routes/index');
var waypoints = require('../routes/waypoints')(handleError);
var races = require('../routes/races')(mongoose, handleError);
var backend = require('../routes/backend');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//roles
app.use(roles.middleware());

// routes ======================================================================
require('../app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.use('/races', races);
app.use('/waypoints', waypoints);
app.use('/backend', backend);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

var race2 = {};
var testUser = {};
var testWaypoint = {};

function getInputDate(date){
    date = new Date(date);
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    var my_date = year+"-"+month+"-"+day;
    return my_date;
}

function makeRequest(route, statusCode, done){
    /*if(cookie != null){
        request(app)
        .get(route)
        .set("cookie",cookie)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }

            done(null, res);
        });
    } else{*/
        request(app)
        .get(route)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }

            done(null, res);
        });
    //}
	
};

function makePostRequest(route, data, statusCode, done){
    /*if(cookie != null){
        request(app)
        .post(route)
        .send(data)
        .set("cookie",cookie)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }
            done(null, res);
        });
    } else{*/
        request(app)
        .post(route)
        .send(data)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }
            done(null, res);
        });
    //}
}

function makePutRequest(route, data, statusCode, done){
    /*if(cookie != null){
        request(app)
        .put(route)
        .send(data)
        .set("cookie",cookie)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }
            done(null, res);
        });
    } else{*/
        request(app)
        .put(route)
        .send(data)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }
            done(null, res);
        });
    //}
    
}

function makeDeleteRequest(route, statusCode, done){
    /*if(cookie != null){
        request(app)
        .delete(route)
        .set("cookie",cookie)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }
            done(null, res);
        });
    } else{*/
        request(app)
        .delete(route)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }
            done(null, res);
        });
    //}
    
}

describe('Testing Race Route',function(){
    before(function(done){
        race = new Race({
            name: "testRace1",
            description: "Dit is een Test Race",
            start: getInputDate(new Date()),
            end: getInputDate(new Date())
        })
        race.save(function(err,race) {
            if(err){ return done(err); }
            race2 = race;
            done();
        });
    })
    describe('Get /races', function(){
        it('should return atleast one Race', function(done){
            makeRequest('/races', 200, function(err, res){
                if(err){ return done(err); }
                expect(parseInt(res.body.totalItems)).to.be.above(0);
                done();
            });
        });
    });
    describe('POST /', function(){
        //it('login beheerder', loginBeheer());
        it('create race correct', function(done){
            EndDate =  new Date();
            EndDate.setDate(EndDate.getDate() + 1);
            makePostRequest('/races',{
	            name: "testRace2",
	            description: "Dit is een Test Race",
	            start: getInputDate(new Date()),
	            end: getInputDate(EndDate)
        }, 201, function(err, res){
                if(err){ return done(err); }
                race2 = res.body;
                expect(res.body.name).to.equal('testRace2');
                done();
            });
        });
        it('create race incorrect', function(done){
            StartDate =  new Date();
            StartDate.setDate(StartDate.getDate() + 1);
            makePostRequest('/races',{
            name: "testRace2",
            description: "Dit is een Test Race",
            start: StartDate,
            end: new Date()
        }, 500, function(err, res){
                if(err){ return done(err); }
                expect(res.error.text).to.contains('Einde moet later zijn dan de Start');
                done();
            });
        });
    });
});