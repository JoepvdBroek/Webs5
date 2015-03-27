var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('beheer.html', { title: 'Race beheer' });
});

module.exports = router;
