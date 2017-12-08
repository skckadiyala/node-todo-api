
//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log("Unable to connect to MongoDB Server");
    }
    console.log('Connected to MongoDB Server');

    // db.collection("Todo").findOneAndUpdate({_id: new ObjectID("5a2af759c14f9eca01108413")}, {
    //     $set:{
    //         completed: true
    //     }
    // }, {returnOriginal: false}).then((result) => {
    //     console.log(result);
    // })

    db.collection("Users").findOneAndUpdate({_id: 1234}, {
        $set:{
            name: "Suman"
        },
        $inc: {
            age: 1
        }

    }, {returnOriginal: false}).then((result) =>
    {
        console.log(result);
    })

    //db.close();
})