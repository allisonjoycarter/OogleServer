// The API toolkit for making REST systems easily
const express = require('express');
const validator = require('express-validator');
// A good solution for handling JSON data in routes
const bodyParser = require('body-parser');
// Node JS modules for filesystem access
const fs = require('fs');
// Our database connection
// This will be a JSON object of our programmers
// and can be accessed as if it was any other javascript
// object
const database = require('./programmers.json');

// Make an instance of our express application
const app = express();
// Specify our > 1024 port to run on
const port = 3000;

// Apply our middleware so our code can natively handle JSON easily
app.use(bodyParser.json());
app.use(validator());

// We must have our list of programmers to use
if (!fs.existsSync('./programmers.json')) {
  throw new Error('Could not find database of programmers!');
}

// Build our routes

app.get('/', (req, res) => {
  res.json(database);
});

app.get('/:id', (req, res, next) => {
  const id = req.params.id;
  //look for the SID requested
  //in the future, a more efficient search should be investigated
  for (var i = 0; i < database.length; i++) {
	//console.log('looking at ' + database[i]);
	if(database[i]["SID"] === id) {
		res.send(database[i]);
		console.log(id);
		//stop after finding item
		return;
	}
  }
  //if we didn't find anything, go to error
  console.log('Tried to find:');
  console.log(id);
  next();
});

app.put('/:id', (req, res, next) => {
  const id = req.params.id;
  //look for id
  for (var i = 0; i < database.length; i++) {
  	if(database[i]["SID"] === id) {
		database[i] = req.body;
		res.send(database[i]);
		return;
	}
  }
  //error if SID is not found
  console.log('Tried to find:');
  console.log(id);
  next();
});

app.post('/', (req, res) => {
  const body = req.body; // Hold your JSON in here!
	//validate that a name and SID exists
	req.checkBody('SID', 'SID is required').notEmpty();
	req.checkBody('firstName', 'firstName is required').notEmpty();
	req.checkBody('lastName', 'lastName is required').notEmpty();
	const errors = req.validationErrors();
	console.log(errors);
	//send a message if JSON is no bueno
	if (errors) {
		res.send("There was a problem with your request, please check that the body of your request contains firstName, lastName, and SID");
	} else {
	  //otherwise all is well, add to database
	  database.push(body);
	  res.sendStatus(200);
	}
});

// IMPLEMENT A ROUTE TO HANDLE ALL OTHER ROUTES AND RETURN AN ERROR MESSAGE
app.get('*', function(req, res) {
	//if the request isn't one of the previous routes, 404 it
	res.status(404).send('Try something that works next time.');
});

app.listen(port, () => {
  console.log(`She's alive on port ${port}`);
});
