var express = require('express');
var _ = require('underscore');
var async = require('async');
var https = require('https');
var request = require('request');
var mongoose = require('mongoose');
var router = express();
var Race;
var Waypoint;
var handleError;
var configAuth = require('../config/auth');

function getWaypointById(id,callback){
	https.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="+id+"&key="+configAuth.googleAuth.APIKey,callback);
}

function fetchWaypoints(req, res, data){
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

	  	Waypoints = [];
	  	_.each(results,function(result){
	  		Waypoints.push(JSON.parse(result[1]).result);
	  	});

	  	data.waypoints = Waypoints;
	  	res.json(data);
	});
}

/*function getRaces(req, res){
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
				res.json(data);
			}
		}
		else {
			res.json(data);
		}
	});
}*/

function getRaces(req, res){
	var query = {};
	var per_page = 10;
	var page = 1;
	if(req.params.id){
		console.log(req.params.id);
		query._id = req.params.id;
		result = Race.find(query);/*.lean().exec(function(err, data){*/
		result.populate('Participants', '-__v -roles -google.email -google.id -google.token -local.password').lean().exec(function(err, data){
			if(err){ return handleError(req, res, 500, err); }

			if(data[0].waypoints !=null  && data[0].waypoints.length> 0){
				fetchWaypoints(req,res,data[0]);
			} else{
				return res.json(data[0]);
			}
		});
	}else{
		start = null;
		if(req.query.start !=null){
			startQuery = req.query.start.split("-");
			start = new Date(startQuery[0],startQuery[1]-1,startQuery[2]);
			query.start = {"$gte" : start};
		}
		if(req.query.eind !=null){
			endQuery = req.query.eind.split("-");
			end = new Date(endQuery[0],endQuery[1]-1,endQuery[2]);
			query.ende = {"$lte" : eind};
		}
		if(req.query.user != null){
			query.Participants = {"$in" : [req.query.user]};
		}
		if(req.query.per_page != null){
			parse_per_page = parseInt(req.query.per_page);
			if(parse_per_page > 100 || parse_per_page < 1){return handleError(req, res, 400 , "Paging between 1 and 100");}
			per_page = parse_per_page;
		}
		if(req.query.page != null){
			parse_page = parseInt(req.query.page);
			if(parse_page < 1){return handleError(req, res, 400 , "Page bigger than 0");}
			page = parse_page;
		}
		Race.paginate(query,page,per_page,function(err,pageCount,results,itemCount){
			if(err){ return handleError(req, res, 500, err); }
			data = {
				results:results,
				pages:pageCount,
				page:page,
				totalItems:itemCount
			}
			res.json(data);
		})
	}
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
				fetchWaypoints(res,data);
			} else {
				res.json(data);
			}
		});
}

function addWaypoint(req, res){
	Waypoint.createIfNotExists(Waypoint,req.body, function(waypoint){
		Race.findById(req.params.id, function(err, race){
			if(err){ return handleError(req, res, 500, err); }
			if(!checkDate(race.end)){ return handleError(req, res, 304, "Race expired"); }
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
		if(!checkDate(race.end)){ return handleError(req, res, 304, "Race expired"); }
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
		if(!checkDate(race.end)){ return handleError(req, res, 304, "Race expired"); }
		race.participants.push(participant);
		race.save(function(err,race){
			if(err){ return handleError(req, res, 500, err); }
				res.json(race);
			});
	});
}

function addRaceTag(req, res){
	participant = req.body.user;
	waypoint = req.body.waypoint;
	Race.findById(req.params.id, function(err, race){
		if(err){ return handleError(req, res, 500, err); }
		if(!checkDate(race.end)){ return handleError(req, res, 304, "Race expired"); }
		//TODO check of tag al bestaat
		if(_.contains(race.participants,participant)){ 
		tag = { participantId: participant, waypointId: waypoint };
		race.tags.push(tag);
		race.save(function(err,race){
			if(err){ return handleError(req, res, 500, err); }
				res.json(race);
			});
		}
		else {
			return handleError(req, res, 304, "Users needs to enroll first");
		}
		
	});
}

function deleteParticipant(req, res){
	Race.findById(req.params.id, function(err, race){
		var participant = race.participants.indexOf(req.params.participantId);
		if(!checkDate(race.end)){ return handleError(req, res, 304, "Race expired"); }
		if(participant >= 0){
			race.participants.splice(participant, 1);
			race.save(function(err){
				if(err){ return handleError(req, res, 500, err); }
				res.json("Participants removed");
			});
		}else{
			return handleError(req, res, 304, "No Participant found");
		}
	});
}

/*returnJSON = 
[
	{
		participantId : '55141859ddef6414234860bb',
		totalTime : LatestTime - earliestTime 
	}
]*/

function getResults(req, res){
	var returnJson = [];
	var one_day=1000*60*60*24;

	Race.findById(req.params.id, function(err, race){
		if(err){ return handleError(req, res, 500, err); }
		if(checkDate(race.end)){ return handleError(req, res, 304, "Race is not done yet"); }
		var tags = race.tags;
		//TODO: voor elke deelnemer 2x door de tags loopen. 1x voor vroegste datum, 1x voor de laatste datum
		for (i = 0; i < race.participants.length; i++) {
			console.log('participant');
			var userId = race.participants[i];
			var earliest = null;
			var latest = null;
			var current = null;
			for (x = 0; x < tags.length; x++) {
				if(tags[x].participantId === userId){
					if(current != null){
						if(tags[x].added_at < current){
							current = tags[x].added_at;
						}
					} else {
						current = tags[x].added_at;
					}
				}
				
			}
			earliest = current;
			current = null;
			for (y = 0; y < tags.length; y++) {
				if(tags[y].participantId === userId){
					if(current != null){
						if(tags[y].added_at > current){
							current = tags[y].added_at;
						}
					} else {
						current = tags[y].added_at;
					}
				}
			}
			latest = current;
			totalTime = (latest - earliest)/one_day;
			//console.log('earliest:'+ earliest + '- latest:'+ latest + '- totaltime:' + totalTime);
			returnJson.push({ participantId : userId , totalTime : totalTime });
        }

        res.json(returnJson);
	});
}

function checkDate(enddate){
	var now = new Date();
  	if ((now - enddate) > 0 ) {
    	return false;
    }
    return true;
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

router.route('/:id/results')
	.get(getResults);

router.route('/:id/waypoints/:waypointId')
	.delete(deleteWaypoint);

router.route('/:id/participants')
	.put(addParticipant);

router.route('/:id/participants/:participantId')
	.delete(deleteParticipant);
	

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing race routing module');
	Race = mongoose.model('Race');
	Waypoint = mongoose.model('Waypoint');
	handleError = errCallback;
	return router;
};