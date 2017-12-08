//const MongoClient = require('mongodb').MongoClient;

const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log("Unable to connect to MongoDB Server");
    }
    console.log('Connected to MongoDB Server');

    // db.collection('Todo').insertOne({
    //     text: "Apply Passport",
    //     completed: false
    // },(err, result) => {
    //     if (err){
    //         return console.log("Unable to insert todo ", err);
    //     }
    //     console.log(JSON.stringify(result.ops,undefined, 2));
    // });

    db.collection('Users').insertOne({
        name: "Suman",
        age: 25,
        location: "Phoenix"
    },(err,result) => {
        if(err){
            return console.log('Unable to insert users', err);
        }
    console.log(JSON.stringify(result.ops,undefined,2));
        console.log(result.ops[0]._id.getTimestamp());
    });

    db.close();
})