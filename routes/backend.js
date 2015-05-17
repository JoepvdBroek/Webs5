var express = require('express');
var router = express();
var socket;

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('beheer.html', { title: 'Race beheer' });
});*/



//module.exports = router;

module.exports = function(roles, io){
	socket = io;
	socket.sockets.on('connection', function (socket) {
        socket.emit('beheer','welkom in beheer');
	});

	/* GET home page. */
    router.route('/').get(roles.can('access beheerder'),function(req, res) {
	    res.render('backend.html', {
	    	title: 'Race beheer', 
	        user : req.user // get the user out of session and pass to template
	    });
	});

	return router;
};
