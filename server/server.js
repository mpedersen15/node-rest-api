require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
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

app.post('/todos', authenticate, (req, res)=>{
	
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});
	
	todo.save().then((todo)=>{
		res.send(todo);
	},(e)=>{
		res.status(400).send(e);
	});
});

app.get('/todos', authenticate, (req, res)=>{
	
	Todo.find({
		_creator: req.user._id
	}).then((todos)=>{
		res.send({todos});
	}, (e)=>{
		res.status(400).send(e);
	});
	
});

app.get('/todos/:id', authenticate, (req, res)=>{
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
	
});

app.delete('/todos/:id', authenticate, (req, res) => {
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
});

app.patch('/todos/:id', authenticate, (req, res) => {
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
});

app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);

	var user = new User(body);
	
	user.save().then(()=>{
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
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
	console.log('Server up on port 3000');
});

module.exports = {app};