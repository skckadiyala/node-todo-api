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

    // db.collection('Todo').find({
    //     completed: false,
    //     _id: new ObjectID('5a2986c8ad677e5e7448235f')
    // }).toArray().then ((docs) => {
    //
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2))
    //
    //     }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    db.collection('Users').find({
        name: 'Suman'
    }).count().then((count) => {

        console.log('Todos count : ', count);
        //console.log(JSON.stringify(docs, undefined, 2))

        }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    db.close();
})