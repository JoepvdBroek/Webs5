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
			name: 'Test race 1',
			description: 'Our First Race', 
			start: new Date(1,8,2014), 
			end: new Date(3,8,2014),
			waypoints :['ChIJDQwJnPG-xkcRvs1Rkmofx_0', 'ChIJmVfSm_G-xkcREPb8HdEX9YY', 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU']	
		},
		{
			name: 'Test race 2',
			description: 'Our Second Race', 
			start: new Date(1,8,2014), 
			end: new Date(3,8,2014),
			waypoints :['ChIJDQwJnPG-xkcRvs1Rkmofx_0', 'ChIJmVfSm_G-xkcREPb8HdEX9YY', 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU']
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