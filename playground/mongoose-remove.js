const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/* Todo.remove({}).then((result) =>{
	console.log(result);
}); */

/* Todo.findOneAndRemove().then((doc) => {
	console.log(doc);
}); */

Todo.findByIdAndRemove('5893fcd57c8c2fa8eadd68e4').then((todo) => {
	console.log(todo);
});