var express = require('express');
var router = express.Router();

// IMport our custom "config" node module.
// It holds a single object that has our MySQL credentials
var config = require('../config/config');
// Include the mysql module. WE got this via npm
var mysql = require('mysql');
var connection =  mysql.createConnection({
	host: config.host,
	user: config.userName,
	password: config.password,
	database: config.database
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Add a post route "addItem" to handle the form submission
router.post('/addItem',(req,res)=>{
	res.json(req.body)
	var newTask = req.body.newTask;
	var dueDate = req.body.newTaskDate;
	// We know what they submitted from the form. It comes to this route
	// inside req.body.NAMEOFFIELD. Now we need to insert it into MySQL.

});

module.exports = router;
