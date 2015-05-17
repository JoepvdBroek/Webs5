var socket = io();
socket.on('beheer', function(line){
	console.log(line)
});

socket.on('new waypoint', function(data){
	console.log(data);

	if(currentRace == data.race){
		$("#waypointlist").append('<li class="list-group-item">'+data.waypoint+'</li>');
	}
});