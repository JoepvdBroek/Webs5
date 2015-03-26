var init = function(mongoose){

	console.log('Initializing race model module');

	var raceSchema = mongoose.Schema({
		Name: { type: String, required: true },
		Description: {type:String,required:true},
		Start: {type: Date, required: true},
		End: { type: Date, required: true},
		Waypoints: [{ type: String, required: true, ref: 'Waypoint'}],
		Participants: [{type:String, required: true, ref: 'User'}],
		Data: [{
			particpantId:{type:String,required:true},
			WaypointId:{type:String,required:true},
			added_at:{ type: Date, default: Date.now ,required:true}
		}]
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true }
	});

	raceSchema.pre('validate', function (next) {
		//var one_day=1000*60*60*24;
		start = new Date(this.Start);
		end = new Date(this.Einde);
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