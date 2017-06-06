var express = require('express');
var router = express.Router();

// IMport our custom "config" node module.
// It holds a single object that has our MySQL credentials
var config = require('../config/config');

console.log(config);

// Include the mysql module. WE got this via npm
var mysql = require('mysql');
var connection =  mysql.createConnection({
	host: config.host,
	user: config.userName,
	password: config.password,
	database: config.database
});

// We are now connected (after this line)!
connection.connect();
// now we can write some awesome quereies!


/* GET home page. */
router.get('/', function(req, res, next) {
	var message = req.query.msg;
	if(message == "added"){
		message = "Your task was added!";
	}else if(message == "updated"){
		message = "Your task was updated!";
	}else if(message == "deleted"){
		message = "Your task was deleted!";
	}
	var selectQuery = "SELECT * FROM tasks";
	// console.log("==========ABOUT TO RUN QUERY=================");
	connection.query(selectQuery, (error,results)=>{
		// console.log("==========ABOUT TO RENDER INDEX=================");
		res.render('index', { 
			message: message,
			taskArray: results
		});
	});  	
});

// Add a post route "addItem" to handle the form submission
router.post('/addItem',(req,res)=>{
	// res.json(req.body)
	var newTask = req.body.newTask;
	var dueDate = req.body.newTaskDate;
	// We know what they submitted from the form. It comes to this route
	// inside req.body.NAMEOFFIELD. Now we need to insert it into MySQL.
	// var insertQuery = "INSERT INTO tasks (taskName, taskDate) VALUES ('"+newTask+"','"+dueDate+"')";
	// var insertQuery = `INSERT INTO tasks (taskName, taskDate) VALUES ('${newTask}','${dueDate}')`;
	var insertQuery = "INSERT INTO tasks (taskName, taskDate) VALUES (?,?)";

	console.log("$$$$$$$$$$$$$$$$READY TO RUN THE INSERT QUERY$$$$$$$$$$$$$$$$");

	// res.send(insertQuery);
	connection.query(insertQuery, [newTask, dueDate], (error, results)=>{
		if(error) throw error;
		console.log("$$$$$$$$$$$$$$$$SENDING BACK TO HOME PAGE$$$$$$$$$$$$$$$$");
		res.redirect('http://localhost:3000/?msg=added');
	});
});

router.get('/delete/:id', (req, res)=>{
	var idToDelete = req.params.id;
	var deleteQuery = "DELETE from tasks WHERE id = " + idToDelete;
	connection.query(deleteQuery,(error,results)=>{
		res.redirect('/?msg=deleted')
	});
	// res.send(idToDelete);
})

// Make a new route to handle the edit page. It will be /edit/IDTOEDIT
router.get('/edit/:id',(req, res)=>{
	var idToEdit = req.params.id;
	var selectQuery = "SELECT * FROM tasks WHERE id = ?";
	connection.query(selectQuery, [idToEdit], (error,results)=>{
		res.render('edit',{
			task: results[0]
		})
		// res.json(results);
	});
});

router.post('/editItem', (req, res)=>{
	// res.json(req.body);
	var newTask = req.body.newTask;
	var newTaskDate =req.body.newTaskDate;
	var idToEdit = req.query.id;
	var updateQuery = "UPDATE tasks SET taskName = ?, taskDate = ? WHERE id = ?";
	connection.query(updateQuery, [newTask,newTaskDate,idToEdit], (error,results)=>{
		res.redirect('/?msg=updated');
	});
});


module.exports = router;
