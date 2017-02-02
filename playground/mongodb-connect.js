const MongoClient = require('mongodb').MongoClient;

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
	
	db.collection('users').insertOne({
		name : "Matt Pedersen",
		age: 27,
		location: "Colorado Springs"
	}, (err, result) => {
		if (err){
			return console.log("Unable to add user document", err);
		}
		
		console.log("New user added");
		console.log(JSON.stringify(result.ops, undefined, 2));
	})
	
	db.close();
});