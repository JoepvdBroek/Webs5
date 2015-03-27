var express = require('express');
var _ = require('underscore');
var async = require('async');
var https = require('https');
var request = require('request');
var router = express();
var Race;
var Waypoint;
var handleError;
var configAuth = require('../config/auth');

function getWaypointById(id,callback){
	https.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="+id+"&key="+configAuth.googleAuth.APIKey,callback);
}

function fetchWaypoints(res,data){
	var asyncTasks = [];
	console.log("has WayPoints");
	_.each(data.waypoints,function(waypoint){
		console.log(waypoint);
		asyncTasks.push(function(callback){
			request.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="+waypoint+"&key="+configAuth.googleAuth.APIKey,callback)
		});
	});
	async.parallel(asyncTasks, function(err,results){
	  	if(err){ return handleError(req, res, 500, err); }

	  	waypoints = [];
	  	_.each(results,function(result){
	  		waypoints.push(JSON.parse(result[1]).result);
	  	})

	  	data.waypoints = waypoints;
	  	//res.json(data);
	  	res.render('race.html', {
	        race : data
	    });
	});
}

function getRaces(req, res){
	var query = {};
	if(req.params.id){
		query._id = req.params.id.toLowerCase();
	}

	Race.find(query).lean().exec(function(err, data){
		if(err){ return handleError(req, res, 500, err.message); }
		
		if(req.params.id){
			data = data[0];
			if(data.waypoints !=null  && data.waypoints.length> 0){
				fetchWaypoints(res,data);
			} else {
				res.render('race.html', {
			        race : data
			    });
			}
		}
		else {
			res.render('races.html', {
	            races : data
	        });
		}
	});
}

function addRace(req, res){
	var race = new Race(req.body);
	race.save(function(err, savedRace){
		if(err){ return handleError(req, res, 500, err); }
		else {
			res.status(201);
			res.json(savedRace);
		}
	});
}

function editRace(req, res){
	Race.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, race){
		if(err){ return handleError(req, res, 400, err); }
		else{
			res.status(200);
			res.json(race);
		}
	});

	//Andere manier die momenteel niet werkt
	//
	/*Race.findById(req.params.id).exec(function(err,race){
		if(err){ return handleError(req, res, 500, err); }
		race.Name = req.body.Name;
		race.Description = req.body.Description;
		race.Start = req.body.Start;
		race.End = req.body.End;
		race.save(function(err,savedRace){
			if(err){ return handleError(req, res, 500, err); }
			res.status(201);
			res.json(savedRace);
		})
	});*/
}

function deleteRace(req,res){
    Race.findById(req.params.id,function(err,race){
        if(race == null){
            res.statusCode = 404;
            res.send({ msg: "404 Not found" });
        }
        race.remove(function(err) {
            if(err){ return handleError(req, res, 500, err); }
			res.json({ message: 'Successfully deleted!' });
        });
    })
}

function getWaypoints(req, res){
	Race.findById(req.params.id)
		.exec(function(err, data){
			if(err){ return handleError(req, res, 500, err); }
			fetchWaypoints(res,data);
			res.json(data);
		});
}

function addWaypoint(req, res){
	Waypoint.createIfNotExists(Waypoint,req.body, function(waypoint){
		Race.findById(req.params.id, function(err, race){
			if(err){ return handleError(req, res, 500, err); }
			if(_.contains(race.Waypoints,waypoint._id)){ return handleError(req, res, 304, "Waypoint already exists"); }
			race.waypoints.push(waypoint._id);
			race.save(function(err,race){
				if(err){ return handleError(req, res, 500, err); }
				request.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="+waypoint._id+"&key="+configAuth.googleAuth.APIKey,function(err,result){
					data = (JSON.parse(result.body).result)
					res.json(data);
				})
			});
		});
	});
}

function deleteWaypoint(req, res){
	Race.findById(req.params.id, function(err, race){
		var waypoint = race.Waypoints.indexOf(req.params.waypointId);
		if(waypoint >= 0){
			race.waypoints.splice(waypoint, 1);
			race.save(function(err){
				if(err){ return handleError(req, res, 500, err); }
				res.json("Waypoint deleted");
			});
		}else{
			return handleError(req, res, 304, "No Waypoint found");
		}
	});
}



// Routing
router.route('/')
	.get(getRaces)
	.post(addRace);

router.route('/:id')
	.get(getRaces)
	.put(editRace)
	.delete(deleteRace);

router.route('/:id/waypoints')
	.get(getWaypoints)
	.put(addWaypoint);

/*router.route('/:id/waypoints/:waypointId')
	.delete(role.can('delete race waypoints'),deleteWaypoint);
	*/

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing race routing module');
	Race = mongoose.model('Race');
	Waypoint = mongoose.model('Waypoint');
	handleError = errCallback;
	return router;
};