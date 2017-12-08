/**
 * Created by kalyan on 12/8/17.
 */
/**
 * Created by kalyan on 12/8/17.
 */
//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log("Unable to connect to MongoDB Server");
    }
    console.log('Connected to MongoDB Server');

  //Delete Many

    // db.collection("Todo").deleteMany({text: "Have Lunch"}).then((result) => {
    //         console.log(result);
    // });

    //Delete One
    // db.collection("Todo").deleteOne({text: "Something todo"}).then((result) => {
    //     console.log(result);
    // });

    // db.collection("Todo").findOneAndDelete({completed : true}).then((result) => {
    //     console.log(result);
    // })

    // db.collection("Users").deleteMany({name: "Suman"}).then((result) => {
    //     console.log(result);
    // })

    db.collection("Users").findOneAndDelete({_id: new ObjectID("5a29879e0236155f77d9b690")}).then((result) => {
        console.log(result)
    })

    //db.close();
})