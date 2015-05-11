var prefix = "https://webs5restrace.herokuapp.com";
//var prefix = "http://localhost:8080";

var per_page = 5;
var currentPage = 1;

var currentRace = '';
var currentEditRace = '';

$(document).ready(function(){
    $('#addraceform').hide();
    $('#updateraceform').hide();
    $('#race').hide();

    $("#addwaypointform").hide();
	$("#addparticipantform").hide();

    if(currentPage == 1){
        $('#prevpage').hide();
    }

    getRaces();

    $('#addracelink').on('click', function(event){
        event.preventDefault();

        //SLideDown wanneer form niet zichtbaar is, anders slideUp
        var form = $("#addraceform");
        if (form.css('display') == 'none'){
            form.slideDown( "slow" );
        } else {
            form.slideUp( "slow" );
        }
    });

    $('#addwaypointlink').on('click', function(event){
	    event.preventDefault();

	    //SLideDown wanneer form niet zichtbaar is, anders slideUp
	    var form = $("#addwaypointform");
	    if (form.css('display') == 'none'){
	        form.slideDown( "slow" );
	    } else {
	        form.slideUp( "slow" );
	    }
	});

	$('#addparticipantlink').on('click', function(event){
	    event.preventDefault();

	    //SLideDown wanneer form niet zichtbaar is, anders slideUp
	    var form = $("#addparticipantform");
	    if (form.css('display') == 'none'){
	        form.slideDown( "slow" );
	    } else {
	        form.slideUp( "slow" );
	    }
	});

    $('#submitrace').on('click', addRace);

    $('#updaterace').on('click', editRace);

    $('#submitwaypoint').on('click', addWaypoint);

    $('#submitparticipant').on('click', addParticipant);

    $( document ).on( 'click', '#deletebutton', deleteRace);

    $( document ).on( 'click', '#editbutton', function(){

        var raceId = $(this).attr('rel');

        //SLideDown wanneer form niet zichtbaar is, anders slideUp
        var form = $("#updateraceform");
        if (form.css('display') == 'none'){
            fillUpdateRaceForm(raceId);
            form.slideDown( "slow" );
        } else {
            if(currentEditRace === raceId){
               form.slideUp( "slow" );
               currentEditRace = '';
            } else {
                fillUpdateRaceForm(raceId);
            }
        }
    });

    $( document ).on( 'click', '#selectrace', selectRace);

    $( document ).on( 'click', '#nextpage', function(){
        currentPage++;
        getRaces();
        $('#prevpage').show();
    });

    $( document ).on( 'click', '#prevpage', function(){
        currentPage--;
        getRaces();
        if(currentPage == 1){
            $('#prevpage').hide();
        }
    });

});

function getRaces(){

    var url = prefix+'/races?per_page='+per_page+'&page='+currentPage;

    $.ajax({
        url: url,
        type:'GET',
        dataType:'json',
        error:function(jqXHR,text_status,strError){
            alert('no connection');
        },
        success:function(response){
            $('#tablebody').empty();
            response = response.results;
            for (i = 0; i < response.length; i++) {
                var html = '<tr>';
                html += '<td><a href="#" id="selectrace" rel="'+response[i]._id+'">'+response[i].name+'</a></td>';
                html += '<td>'+response[i].start+'</td>';
                html += '<td>'+response[i].end+'</td>';
                html += '<td><button id="editbutton" class="btn btn-primary" rel="'+response[i]._id+'">Wijzig</button> <button id="deletebutton" class="btn btn-danger" rel="'+response[i]._id+'">Verwijder</button></td>';
                html += '</tr>';
                $('#tablebody').append(html);
            }
        }
    });
}

function addRace(){
    var name = $('#name').val();
    var description = $('#description').val();
    var start = $('#start').val();
    var end = $('#end').val();

    var newRace = { name: name, description: description, start: start, end: end};

    var url = prefix+'/races';

    $.ajax({
        url: url,
        type:'POST',
        dataType:'json',
        data: newRace,
        error:function(jqXHR,text_status,strError){
            alert('no connection');
        },
        success:function(response){
            var html = '<tr>';
            html += '<td><a href="#" id="selectrace" rel="'+response._id+'">'+response.name+'</a></td>';
            html += '<td>'+response.start+'</td>';
            html += '<td>'+response.end+'</td>';
            html += '<td><button id="editbutton" class="btn btn-primary" rel="'+response._id+'">Wijzig</button> <button id="deletebutton" class="btn btn-danger" rel="'+response._id+'">Verwijder</button></td>';
            html += '</tr>';
            $('#tablebody').append(html);

            $("#addform").slideUp( "slow" );
        }
    });
}

function deleteRace(){
    var confirmation = confirm('Bent u zeker dat u deze race wilt verwijderen?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        var url = prefix+'/races/'+$(this).attr('rel');

        $.ajax({
            url: url,
            type:'DELETE',
            dataType:'json',
            error:function(jqXHR,text_status,strError){
                alert('no connection');
            },
            success:function(response){
                location.reload();
            }
        });

    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
}

function editRace(){
    var name = $('#updatename').val();
    var description = $('#updatedescription').val();
    var start = $('#updatestart').val();
    var end = $('#updateend').val();

    var updateRace = { name: name, description: description, start: start, end: end};
    console.log(updateRace);

    var url = prefix+'/races/'+currentEditRace;
    console.log(url);

    $.ajax({
        url: url,
        type:'PUT',
        dataType:'json',
        data: updateRace,
        error:function(jqXHR,text_status,strError){
            alert('no connection');
        },
        success:function(response){
            location.reload();
        }
    });
}

function selectRace(event){
    event.preventDefault();

    currentRace = $(this).attr('rel');

    var url = prefix+'/races/'+currentRace;

    $.ajax({
        url: url,
        type:'GET',
        dataType:'json',
        error:function(jqXHR,text_status,strError){
            alert('no connection');
        },
        success:function(response){
        	//Fill list with participants
        	var waypoints = '';
            for (i = 0; i < response.waypoints.length; i++) {
                waypoints += '<li class="list-group-item">'+response.waypoints[i].name+'</li>'; 
            }
            $("#waypointlist").html(waypoints);

            //Fill list with participants
            var participants = '';
            for (i = 0; i < response.participants.length; i++) {
                participants += '<li class="list-group-item">'+response.participants[i]+'</li>'; 
            }
            $("#participantslist").html(participants);

            if ( $('#race').css('display') == 'none' ){
		        $('#race').slideDown( "slow" );
		    }
        }
    });
}

function addWaypoint(){
	var placeId = $('#waypoint').val();

    var newWaypoint = { _id: placeId };

    var url = prefix+'/races/'+currentRace+'/waypoints';
    console.log(url);

    $.ajax({
        url: url,
        type:'PUT',
        dataType:'json',
        data: newWaypoint,
        error:function(jqXHR,text_status,strError){
            alert('no connection');
        },
        success:function(response){
            console.log(response);
            $("#waypointlist").append('<li class="list-group-item">'+response.name+'</li>');
        }
    });
}

function addParticipant(){

}

function fillUpdateRaceForm(raceId){

    var url = prefix+'/races/'+raceId;

    $.ajax({
        url: url,
        type:'GET',
        dataType:'json',
        error:function(jqXHR,text_status,strError){
            alert('no connection');
        },
        success:function(response){
            var enddate = response.end.toString();
            var startdate = response.start.toString();

            enddate = enddate.slice(0, - 1);
            startdate = startdate.slice(0, - 1);

            currentEditRace = raceId;
            $('#updatename').val(response.name);
            $('#updatedescription').val(response.description);

            $('#updatestart').val(startdate);
            $('#updateend').val(enddate);
        }
    });
}
