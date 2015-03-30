var init = function(mongoose){
	var waypointSchema = mongoose.Schema({
		_id: {type:String,required:true,unique:true}
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true }
	});

	waypointSchema.statics.createIfNotExists = function(Waypoint,waypoint, callback){
		Waypoint.findById(waypoint._id, function(err, foundWaypoint){
			if(!foundWaypoint){
				new Waypoint(waypoint).save(function(err, savedWaypoint){
					callback(savedWaypoint);
				});
			}else{
				callback(foundWaypoint);
			}
		});
	};

	// methods ======================
	// generating a hash

	return mongoose.model('Waypoint', waypointSchema);
};

module.exports = init;