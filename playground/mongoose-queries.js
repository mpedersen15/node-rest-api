const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/* var id = '589241cf108c341af02e5d280';

if (!ObjectId.isValid(id)){
	console.log('ID not valid');
} */

/* Todo.find({
	_id: id
}).then((todos)=> {
	console.log('Todos',todos);
});

Todo.findOne({
	_id: id
}).then((todo)=> {
	console.log('Todo',todo);
}); */

/* Todo.findById(id).then((todo)=> {
	if (!todo){
		return console.log('ID not found');
	}
	console.log('Todo by ID',todo);
}).catch((e) => console.log(e) ); */



var id = '5892b1d02425320d106b424a';
User.findById(id).then((user)=> {
	if (!user){
		return console.log('User not found');
	}
	console.log('User by ID',user);
}).catch((e) => console.log(e) );