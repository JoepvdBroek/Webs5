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

function fetchWaypoints(res,waypoints){
	var asyncTasks = [];
	console.log("has WayPoints");
	_.each(waypoints,function(waypoint){
		console.log(waypoint);
		asyncTasks.push(function(callback){
			request.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="+waypoint+"&key="+configAuth.googleAuth.APIKey,callback)
		});
	});
	async.parallel(asyncTasks, function(err,results){
	  	if(err){ return handleError(req, res, 500, err); }

	  	Waypoints = [];
	  	_.each(results,function(result){
	  		Waypoints.push(JSON.parse(result[1]).result);
	  	});

	  	waypoints = Waypoints;
	  	res.json(waypoints);
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
			// if(data.waypoints !=null  && data.waypoints.length> 0){
			// 	fetchWaypoints(res,data);
			// } else {
				res.json(data);
			//}
		}
		else {
			res.json(data);
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
			if(data.waypoints !=null  && data.waypoints.length> 0){
				fetchWaypoints(res,data.waypoints);
			} else {
				res.json(data);
			}
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
		var waypoint = race.waypoints.indexOf(req.params.waypointId);
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

function addParticipant(req, res){
	participant = req.body.user;
	Race.findById(req.params.id, function(err, race){
		if(err){ return handleError(req, res, 500, err); }
		if(_.contains(race.participants,participant)){ return handleError(req, res, 304, "Participant already enroled"); }
		race.participants.push(participant);
		race.save(function(err,race){
			if(err){ return handleError(req, res, 500, err); }
				res.json(race);
			})
	});
}

/*tags: [{
		participantId:{type:String,required:true},
		waypointId:{type:String,required:true},
		added_at:{ type: Date, default: Date.now ,required:true}
	}]*/

function addRaceTag(req, res){
	participant = req.body.user;
	waypoint = req.body.waypointId;
	Race.findById(req.params.id, function(err, race){
		if(err){ return handleError(req, res, 500, err); }
		//TODO check of tag al bestaat
		if(_.contains(race.participants,participant)){ 
		tag = { participantId: participant, waypointId: waypoint };
		race.tags.push(tag);
		race.save(function(err,race){
			if(err){ return handleError(req, res, 500, err); }
				res.json(race);
			})
		}
		else {
			return handleError(req, res, 304, "Users needs to enroll first");
		}
		
	});
}

function deleteParticipant(req, res){
	Race.findById(req.params.id, function(err, race){
		var participant = race.participants.indexOf(req.params.participantId);
		if(participant >= 0){
			race.participants.splice(waypoint, 1);
			race.save(function(err){
				if(err){ return handleError(req, res, 500, err); }
				res.json("Participants removed");
			});
		}else{
			return handleError(req, res, 304, "No Participant found");
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

router.route('/:id/tags')
		.put(addRaceTag);

router.route('/:id/waypoints')
	.get(getWaypoints)
	.put(addWaypoint);

router.route('/:id/waypoints/:waypointId')
	.delete(deleteWaypoint);

router.route('/:id/participants')
	.put(addParticipant);

router.route('/:id/participants/participantId')
	.delete(deleteParticipant);
	

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing race routing module');
	Race = mongoose.model('Race');
	Waypoint = mongoose.model('Waypoint');
	handleError = errCallback;
	return router;
};