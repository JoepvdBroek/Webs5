var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('beheer.html', { title: 'Race beheer' });
});*/

router.route('/').get(function(req, res) {
	console.log("test2");
    res.render('backend.html', {
    	title: 'Race beheer', 
        user : req.user // get the user out of session and pass to template
    });
});

module.exports = router;
