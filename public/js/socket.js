var socket = io();
socket.on('beheer', function(line){
	console.log(line)
});

socket.on('new waypoint', function(data){
	console.log(data);
	/*if(raceId == data.race){
		html = "<tr>";
		html += '<td><span>'+data.participant+'<span></td>';
		html += "</tr>";
		$(".tableCurrentDeelnemers").append(html);
		html = "";
	}*/
});