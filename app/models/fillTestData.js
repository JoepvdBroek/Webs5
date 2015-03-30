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
			start: new Date(2014, 1, 8), 
			end: new Date(2014, 3, 8),
			waypoints :['ChIJDQwJnPG-xkcRvs1Rkmofx_0', 'ChIJmVfSm_G-xkcREPb8HdEX9YY', 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU'],
			participants :['55141859ddef6414234860bb', '55128141e4b629ecc2e28e51'],
			tags: [
				{
					participantId: '55141859ddef6414234860bb',
					waypointId: 'ChIJDQwJnPG-xkcRvs1Rkmofx_0',
					added_at: new Date(2014, 1, 10)
				},
				{
					participantId: '55141859ddef6414234860bb',
					waypointId: 'ChIJmVfSm_G-xkcREPb8HdEX9YY',
					added_at: new Date(2014, 1, 11)
				},
				{
					participantId: '55141859ddef6414234860bb',
					waypointId: 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU',
					added_at: new Date(2014, 1, 12)
				},
				{
					participantId: '55128141e4b629ecc2e28e51',
					waypointId: 'ChIJDQwJnPG-xkcRvs1Rkmofx_0',
					added_at: new Date(2014, 1, 20)
				},
				{
					participantId: '55128141e4b629ecc2e28e51',
					waypointId: 'ChIJmVfSm_G-xkcREPb8HdEX9YY',
					added_at: new Date(2014, 1, 22)
				},
				{
					participantId: '55128141e4b629ecc2e28e51',
					waypointId: 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU',
					added_at: new Date(2014, 1, 24)
				}
			]
		},
		{
			name: 'Test race 2',
			description: 'Our Second Race', 
			start: new Date(2014, 2, 8), 
			end: new Date(2014, 3, 8),
			waypoints :['ChIJDQwJnPG-xkcRvs1Rkmofx_0', 'ChIJmVfSm_G-xkcREPb8HdEX9YY', 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU'],
			participants :['55141859ddef6414234860bb', '55128141e4b629ecc2e28e51']
		},
		{
			name: 'Test race 3',
			description: 'Our Third Race', 
			start: new Date(2014, 1, 8), 
			end: new Date(2014, 3, 8),
			waypoints :['ChIJDQwJnPG-xkcRvs1Rkmofx_0', 'ChIJmVfSm_G-xkcREPb8HdEX9YY', 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU'],
			participants :['55141859ddef6414234860bb', '55128141e4b629ecc2e28e51']
		},
		{
			name: 'Test race 4',
			description: 'Our Fourth Race', 
			start: new Date(2014, 4, 4), 
			end: new Date(2014, 5, 8),
			waypoints :['ChIJDQwJnPG-xkcRvs1Rkmofx_0', 'ChIJmVfSm_G-xkcREPb8HdEX9YY', 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU'],
			participants :['55141859ddef6414234860bb', '55128141e4b629ecc2e28e51']
		},
		{
			name: 'Test race 5',
			description: 'Our Fifth Race', 
			start: new Date(2014, 2, 2), 
			end: new Date(2014, 3, 6),
			waypoints :['ChIJDQwJnPG-xkcRvs1Rkmofx_0', 'ChIJmVfSm_G-xkcREPb8HdEX9YY', 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU'],
			participants :['55141859ddef6414234860bb', '55128141e4b629ecc2e28e51']
		},
		{
			name: 'Test race 6',
			description: 'Our Sixth Race', 
			start: new Date(2014, 4, 16), 
			end: new Date(2014, 5, 20),
			waypoints :['ChIJDQwJnPG-xkcRvs1Rkmofx_0', 'ChIJmVfSm_G-xkcREPb8HdEX9YY', 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU'],
			participants :['55141859ddef6414234860bb', '55128141e4b629ecc2e28e51']
		},
		{
			name: 'Test race 7',
			description: 'Our Seventh Race', 
			start: new Date(2014, 2, 15), 
			end: new Date(2014, 3, 20),
			waypoints :['ChIJDQwJnPG-xkcRvs1Rkmofx_0', 'ChIJmVfSm_G-xkcREPb8HdEX9YY', 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU'],
			participants :['55141859ddef6414234860bb', '55128141e4b629ecc2e28e51']
		},
		{
			name: 'Test race 8',
			description: 'Our Eigth Race', 
			start: new Date(2014, 5, 20), 
			end: new Date(2014, 6, 22),
			waypoints :['ChIJDQwJnPG-xkcRvs1Rkmofx_0', 'ChIJmVfSm_G-xkcREPb8HdEX9YY', 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU'],
			participants :['55141859ddef6414234860bb', '55128141e4b629ecc2e28e51']
		},
		{
			name: 'Test race 9',
			description: 'Our Ninth Race', 
			start: new Date(2014, 7, 18), 
			end: new Date(2014, 8, 28),
			waypoints :['ChIJDQwJnPG-xkcRvs1Rkmofx_0', 'ChIJmVfSm_G-xkcREPb8HdEX9YY', 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU'],
			participants :['55141859ddef6414234860bb', '55128141e4b629ecc2e28e51']
		},
		{
			name: 'Test race 10',
			description: 'Our Tenth Race', 
			start: new Date(2014, 9, 5), 
			end: new Date(2014, 10, 6),
			waypoints :['ChIJDQwJnPG-xkcRvs1Rkmofx_0', 'ChIJmVfSm_G-xkcREPb8HdEX9YY', 'ChIJ_z5Eqe--xkcR2V2nBlMlPdU'],
			participants :['55141859ddef6414234860bb', '55128141e4b629ecc2e28e51']
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