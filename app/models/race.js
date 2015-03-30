var init = function(mongoose){

	console.log('Initializing race model module');

	var raceSchema = mongoose.Schema({
		name: { type: String, required: true },
		description: {type:String,required:true},
		start: {type: Date, required: true},
		end: { type: Date, required: true},
		waypoints: [{ type: String, required: true, ref: 'Waypoint'}],
		participants: [{type:String, required: true, ref: 'User'}],
		tags: [{
			participantId:{ type:String, required:true },
			waypointId:{ type:String, required:true },
			added_at:{ type: Date, default: Date.now ,required:true }
		}]
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true }
	});

	raceSchema.pre('validate', function (next) {
		start = new Date(this.start);
		end = new Date(this.end);
	  	if (end < start) {
        	this.invalidate("Einde","Einde moet later zijn dan de Start");
	    }
	    next();
	});
	//raceSchema.plugin(mongoosePaginate);
	

	// methods ======================
	// generating a hash

	return mongoose.model('Race', raceSchema);
};

module.exports = init;