var ConnectRoles = require('connect-roles');

module.exports = function(){
	var roles = new ConnectRoles({
  		failureHandler: function (req, res, action) {
  			res.status(401)
      		res.render('access-denied', {action: action});
	  	}
	});

	roles.use('access beheerder', function (req) {
			if(!req.user){ return false};
	  		if(req.user.hasAnyRole('beheerder')){
	  			return true;
	  		};
	});

	roles.use('add races', function (req) {
		if(!req.user){ return false};
	  		if(req.user.hasAnyRole('beheerder')){
	  			return true;
	  		};
	});

	roles.use('edit race', function (req) {
		if(!req.user){ return false};
	  		if(req.user.hasAnyRole('beheerder')){
	  			return true;
	  		};
	});

		roles.use('delete race', function (req) {
		if(!req.user){ return false};
	  		if(req.user.hasAnyRole('beheerder')){
	  			return true;
	  		};
	});

	roles.use('add race waypoints', function (req) {
		if(!req.user){ return false};
	  		if(req.user.hasAnyRole('beheerder')){
	  			return true;
	  		};
	});

	roles.use('delete race waypoints', function (req) {
		if(!req.user){ return false};
	  		if(req.user.hasAnyRole('beheerder')){
	  			return true;
	  		};
	});

	roles.use('add race participants', function (req) {
		if(!req.user){ return false};
		return true;
	});

	roles.use('add race data', function (req) {
		if(!req.user){ return false};
		return true;
	});

	roles.use('delete race participants', function (req) {
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