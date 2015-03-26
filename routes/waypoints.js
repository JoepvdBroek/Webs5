var express = require('express');
var _ = require('underscore');
var https = require('https');
var router = express();
// var configAuth = require('../config/auth');
var handleError;

function getWaypoints(req, res){
	
	/*var query = require('url').parse(req.url,true).query;
	if((query.search === undefined || query.search.length < 1) && query.pagetoken === undefined ){ return handleError(req, res, 404, "Geen Query gevonden");  }
	if(query.pagetoken !== undefined){
		url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken="+query.pagetoken+"&key="+configAuth.googleAuth.APIKey;
		RetrieveData(res,url);
	}else{
		https.get("https://maps.googleapis.com/maps/api/geocode/json?address="+query.search+"&key="+configAuth.googleAuth.APIKey,function(response){
			var data = '';
			response.on('data',function(d){
				data += d;
			});
			response.on('end',function(){
				try {
		            data = JSON.parse(data);
		        } catch (err) {
		             return handleError(req, res, 500, err); 
		        }
		        //var results = {};
		        geoCord = data.results[0].geometry.location;
		        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+geoCord.lat+","+geoCord.lng+"&radius=5000&types=cafe&rankBy=distance&key="+configAuth.googleAuth.APIKey;
				console.log(url);
				RetrieveData(res,url);

			});
		});
	}*/
}

function RetrieveData(res,url){
	/*https.get(url,function(response){
		data = '';
		response.on('data',function(d){
			data += d;
		});
		response.on('end',function(){
			try {
	            data = JSON.parse(data);
	        } catch (err) {
	             return handleError(req, res, 500, err); 
	        }
			res.json(data);
		});
	});*/
}

module.exports = function (errCallback){
	handleError = errCallback;
	
	// Routing
	router.route('/')
		.get(getWaypoints)

	return router;
};