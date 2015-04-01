var ConnectRoles = require('connect-roles');

module.exports = function(){
	var roles = new ConnectRoles({
  		failureHandler: function (req, res, action) {
    // optional function to customise code that runs when
    // user fails authorisation
    var accept = req.headers.accept || '';
    res.status(403);
    if (~accept.indexOf('html')) {
      //res.render('access-denied', {action: action});
      res.render('index.html');

    } else {
      res.send('Access Denied - You don\'t have permission to: ' + action);
    }
  }
	});

	roles.use('access beheerder', function (req) {
		if(!req.user){ return false};
	  		if(req.user.hasAnyRole('beheerder')){
	  			console.log("access beheerder: true");
	  			return true;
	  		};
	});

	roles.use('access normal user', function (req) {
		if(!req.user){ return false};
		return true;
	});

	// Admins can do everything
	roles.use(function (req) {
  		if(req.user.hasAnyRole('admin')){
  			return true;
  		};
	});

	return roles;
};