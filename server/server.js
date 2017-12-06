require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Sleep} = require('./models/sleep');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, x-auth');

	res.setHeader('Access-Control-Expose-Headers', 'x-auth');
	
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.post('/sleeps', authenticate, (req, res) => {
	let now = new Date().getTime();
	var sleep = new Sleep({
		rawData: req.body.rawData,
		startTime: now,
		endTime: now + 6*3600*1000,
		_creator: req.user._id
	});
	
	sleep.save().then((sleep)=>{
		res.send(sleep);
	},(e)=>{
		res.status(400).send(e);
	});
});

app.get('/sleeps', authenticate, (req, res) => {
	Sleep.find({ _creator: req.user._id})
		.then(
			sleeps => res.send({sleeps}),
			e => res.status(404).send(e)
		);
});

/* app.get('/todos/:id', authenticate, (req, res)=>{
	var id = req.params.id;
	
	if (!ObjectID.isValid(id)){
		return res.status(404).send();
	}
	
	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		if (!todo){
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) =>{
		res.status(400).send();
	});
	
}); */

/* app.delete('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;
	
	if (!ObjectID.isValid(id)){
		return res.status(404).send();
	}
	
	Todo.findOneAndRemove({
		_id: id,
		_creator: req.user._id
	}).then((todo)=> {
		if (!todo){
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) =>{
		res.status(400).send();
	}); 
}); */

/* app.patch('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;
	
	var body = _.pick(req.body, ['text', 'completed']);
	
	if (!ObjectID.isValid(id)){
		return res.status(404).send();
	}
	
	if (_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}
	
	Todo.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
	}, {$set: body},{new: true}).then((todo)=> {
		if (!todo){
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) =>{
		res.status(400).send();
	}); 
}); */

app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);

	console.log(JSON.stringify(body));

	var user = new User(body);
	
	user.save().then(()=>{
		console.log('Need to generate auth token');
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		console.log(JSON.stringify(e));
		let error = e;
		if (e.errmsg && e.errmsg.indexOf('duplicate key error')) {
			error = {
				message: "A user with that email already exists. Please login to continue."
			};
		}else if(e.errors && e.errors.password.message.indexOf('shorter than minimum')) {
			error = {
				message: "Chosen password is shorter than the minimum length"
			};
		}
		
		res.status(400).send(error);
	});
});


app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

app.post('/users/login', (req,res) => {
	var body = _.pick(req.body, ['email','password']);
	
	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		})
		
	}).catch((e) => {
		console.log(e);
		res.status(400).send(e);
	});
});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
	});
});

app.listen(port, ()=>{
	console.log(`Server up on port ${port}`);
});

module.exports = {app};