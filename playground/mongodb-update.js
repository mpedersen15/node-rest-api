const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
	if (err){
		return console.log("Error connecting to db");
	}
	
	console.log("Connected to MongoDB server");
	
	/* db.collection('Todos').insertOne({
		text: "Something to do",
		completed: false
	}, (err, result)=>{
		if (err){
			return console.log('Could not add document', err);
		}
		
		console.log(JSON.stringify(result.ops, undefined, 2));
	}); */
	
	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('588eb5cf1655e314c4933d36')
	},{
		$set:{
			name: "Matthew Pedersen"
		},
		$inc:{
			age: 1
		}
	},{
		returnOriginal: false
	}).then( (result)=>{
		console.log(result);
	});
	
	db.close();
});