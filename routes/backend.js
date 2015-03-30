var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('beheer.html', { title: 'Race beheer' });
});*/

router.route('/').get(ensureAuthenticated,function(req, res) {
    res.render('backend.html', {
    	title: 'Race beheer', 
        user : req.user // get the user out of session and pass to template
    });
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

module.exports = router;
