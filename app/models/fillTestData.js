var Race, Waypoint;

function saveCallback(err){
	if(err){
		console.log('Fill testdata failed, reason: %s', err)
	}
};

function fillTestRaces(callback){
	var testData = [
		// Vul hier je testdata voor boeken in 
		// {}, {}, {}
		{
			Name: 'Test race 1',
			Description: 'Our First Race', 
			Start: new Date(1,8,2014), 
			End: new Date(3,8,2014),
			Waypoints :['ChIJDQwJnPG-xkcRvs1Rkmofx_0', 'ChIJmVfSm_G-xkcREPb8HdEX9YY', 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU']	
		},
		{
			Name: 'Test race 2',
			Description: 'Our Second Race', 
			Start: new Date(1,8,2014), 
			End: new Date(3,8,2014),
			Waypoints :['ChIJDQwJnPG-xkcRvs1Rkmofx_0', 'ChIJmVfSm_G-xkcREPb8HdEX9YY', 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU']
		}

	];

	Race.find({}, function(err, data){
		// Als er nog geen boeken zijn vullen we de testdata
		if(data.length == 0){
			console.log('Creating races testdata');
			
			testData.forEach(function(race){
				new Race(race).save(saveCallback);
			});
		} else{
			console.log('Skipping create races testdata, already present');
		}

		if(callback){ callback(); }
	});
};

function fillTestWaypoints(callback){
	var testData = [
		// Vul hier je testdata voor authors in 
		// {}, {}, {}
		{
			_id : 'ChIJDQwJnPG-xkcRvs1Rkmofx_0'
		},
		{
			_id: 'ChIJmVfSm_G-xkcREPb8HdEX9YY'
		},
		{
			_id: 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU'
		}
	];

	Waypoint.find({}, function(err, data){
		// Als er nog geen author zijn vullen we de testdata
		if(data.length == 0){
			console.log('Creating waypoints testdata');
			
			testData.forEach(function(waypoint){
				new Waypoint(waypoint).save(saveCallback);
			});
		} else{
			console.log('Skipping create waypoints testdata, already present');
		}

		if(callback){ callback(); }
	});
};

module.exports = function(mongoose){
	Race = mongoose.model('Race');
	Waypoint = mongoose.model('Waypoint');

	fillTestWaypoints(fillTestRaces);
}