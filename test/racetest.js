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
var races = require('../routes/races')(mongoose, roles, handleError);
var backend = require('../routes/backend')(roles);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', path.join(__dirname, '../views/'));
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

var cookie;
var race2 = {};
var testUser = { _id : "551a98c117b76600059611d0" };
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
    if(cookie != null){
        request(app)
        .get(route)
        .set("cookie",cookie)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }

            done(null, res);
        });
    } else{
        request(app)
        .get(route)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }

            done(null, res);
        });
    }
	
};

function makePostRequest(route, data, statusCode, done){
    if(cookie != null){
        request(app)
        .post(route)
        .send(data)
        .set("cookie",cookie)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }
            done(null, res);
        });
    } else{
        request(app)
        .post(route)
        .send(data)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }
            done(null, res);
        });
    }
}

function makePutRequest(route, data, statusCode, done){
    if(cookie != null){
        request(app)
        .put(route)
        .send(data)
        .set("cookie",cookie)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }
            done(null, res);
        });
    } else{
        request(app)
        .put(route)
        .send(data)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }
            done(null, res);
        });
    }
    
}

function makeDeleteRequest(route, statusCode, done){
    if(cookie != null){
        request(app)
        .delete(route)
        .set("cookie",cookie)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }
            done(null, res);
        });
    } else{
        request(app)
        .delete(route)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }
            done(null, res);
        });
    }
    
}

function loginBeheer() {
    return function(done) {
        request(app)
            .post('/login')
            .send({ email: 'beheerder', password: 'beheerder' })
            .expect(302)
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           cookie = res.headers['set-cookie'];
           return done();
        }
    };
};

function loginUser() {
    return function(done) {
        request(app)
            .post('/login')
            .send({ email: 'joep28_12@hotmail.com', password: 'joep12' })
            .expect(302)
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           cookie = res.headers['set-cookie'];
           return done();
        }
    };
};

function signupUser() {
    return function(done) {
        request(app)
            .post('/signup')
            .send({ email: 'signuptest', password: 'test'})
            .expect(302)
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           cookie = res.headers['set-cookie'];
           return done();
        }
    };
};

describe('Testing beheer route', function(){
    describe('without login', function(){
        it('should return 401', function(done){
            makeRequest('/backend', 401, function(err, res){
                if(err){ return done(err); }
                done();
            });
        });
    });
    describe('with beheer login', function(){
        it('login beheerder', loginBeheer());
        console.log('cookie: '+ cookie);
        it('uri that requires beheerder to be logged in', function(done){
            makeRequest('/backend', 200, function(err, res){
                if(err){ return done(err); }
                done();
            });
        });
        it('logout beheer',function(done){
            makeRequest('/logout', 302, function(err, res){
                if(err){ return done(err); }
                cookie = null;
                done();
            });
        })
    });
    describe('with user login',function(){
        it('login user', loginUser());
        it('uri that requires beheer to be logged in', function(done){
            makeRequest('/backend', 401, function(err, res){
                if(err){ return done(err); }
                done();
            });
        });
        it('logout user',function(done){
            makeRequest('/logout', 302, function(err, res){
                if(err){ return done(err); }
                cookie = null;
                done();
            });
        });
    });
});


describe('Testing profile route', function(){
    describe('without login', function(){
        it('should return 302 move to login', function(done){
            makeRequest('/profile', 302, function(err, res){
                if(err){ return done(err); }
                done();
            });
        });
    });
    describe('with user login',function(){
        it('login user', loginUser());
        it('uri that requires user to be logged in', function(done){
            makeRequest('/profile', 200, function(err, res){
                if(err){ return done(err); }
                done();
            });
        });
        it('logout user',function(done){
            makeRequest('/logout', 302, function(err, res){
                if(err){ return done(err); }
                cookie = null;
                done();
            });
        });
    });
});




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
    });

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
        it('login beheerder', loginBeheer());
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

     describe('Waypoints',function(){
        describe('GET /',function(){
            it('get Waypoints with no results', function(done){
                makeRequest('/races/'+race2._id+"/waypoints", 200, function(err, res){
                    if(err){ return done(err); }
                    expect(res.body.waypoints.length).to.equal(0);
                    done();
                });
            });
        });
        describe('PUT /',function(){
            it('add Waypoint to race', function(done){
                makePutRequest('/races/'+race2._id+"/waypoints",{_id:"ChIJDQwJnPG-xkcRvs1Rkmofx_0"}, 200, function(err, res){
                    if(err){ return done(err); }
                    expect(res.body.place_id).to.equal("ChIJDQwJnPG-xkcRvs1Rkmofx_0");
                    done();
                });
            });
        });
        describe('GET /',function(){
            it('get Waypoints with results', function(done){
                makeRequest('/races/'+race2._id, 200, function(err, res){
                    if(err){ return done(err); }
                    testWaypoint = res.body.waypoints[0];
                    expect(res.body.waypoints[0].place_id).to.equal("ChIJDQwJnPG-xkcRvs1Rkmofx_0");
                    done();
                });
            });
        });
    });

    describe('Participants',function(){
        /*before(function(done){
            User.findOne({"local.email":"joep28_12@hotmail.com"},function(err,user) {
                if(err){ return done(err); }
                user.save(function(err,user){
                    if(err){ return done(err); }
                    testUser = user;
                    done();
                })
            });
        });*/


        //IS MET STATIC ID, MOET EIGEN EERST EEN OPHALEN UIT MODELS, MAAR GEEFT ERROR
        describe('PUT /',function(){
            it('add participant to race', function(done){
                makePutRequest('/races/'+race2._id+"/participants",{user: testUser._id}, 200, function(err, res){
                        if(err){ return done(err); }
                        expect(res.body.participants[0]).to.equal(testUser._id);
                        done();
                });
            });
        });
    });  

    describe('Tags',function(){
        describe('PUT /',function(){
            it('add correct data to race', function(done){
                makePutRequest('/races/'+race2._id+"/tags",
                    {
                        user:testUser._id,
                        waypoint:testWaypoint.place_id,
                    }
                    , 200, function(err, res){
                        if(err){ return done(err); }
                        expect(res.body.tags[0].waypointId).to.equal(testWaypoint.place_id);
                        done();
                });
            });
        });
    });

    describe('Deletes',function(){
        /*before(function(){
            Race.findById(race2._id,function(err,race){
                race.end = new Date();
                race.start = new Date();
                race.save(function(err,race){
                    race2 = race;
                });
            });
        });*/
        describe('waypoints',function(){
            it('delete Waypoint', function(done){
                makeDeleteRequest('/races/'+race2._id+"/waypoints/ChIJDQwJnPG-xkcRvs1Rkmofx_0", 200, function(err, res){
                    if(err){ return done(err); }
                    expect(res.text).to.contains('Successfully deleted');
                    done();
                });
            });
            it('delete Waypoint error', function(done){
                makeDeleteRequest('/races/'+race2._id+"/waypoints/ChIJDQwJnPG-xkcRvs1Rkmofx_0", 304, function(err, res){
                    if(err){ return done(err); }
                    done();
                });
            });
        });
        describe('participant',function(){
            it('delete participant', function(done){
                makeDeleteRequest('/races/'+race2._id+"/participants/"+testUser._id, 200, function(err, res){
                    if(err){ return done(err); }
                    expect(res.text).to.contains('Successfully removed');
                    done();
                });
            });
            it('delete participant error', function(done){
                makeDeleteRequest('/races/'+race2._id+"/participants/"+testUser._id, 304, function(err, res){
                    if(err){ return done(err); }
                    done();
                });
            });
        });
        describe('race',function(){
            it('delete race correct', function(done){
                makeDeleteRequest('/races/'+race2._id, 200, function(err, res){
                    if(err){ return done(err); }
                    expect(res.text).to.contains('Successfully deleted!');
                    done();
                });
            })
            it('delete race incorrect', function(done){
                makeDeleteRequest('/races/123', 404, function(err, res){
                    if(err){ return done(err); }
                    done();
                });
            });
        });
    });

});


describe("remove test shit",function(){
    it("should remove test user",function(){
        User.remove({"local.email":"signuptest"},function(err) {
            if(err){ return done(err); }
            done();
        });
    })
    it("should remove testrace 1",function(){
        Race.remove({"name":"testRace1"},function(err) {
            if(err){ return done(err); }
            done();
        });
    })
    it("should remove testrace 2",function(){
        Race.remove({"name":"testRace2"},function(err) {
            if(err){ return done(err); }
            done();
        });
    })
})