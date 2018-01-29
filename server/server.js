var express = require('express');
var bodyParser = require('body-parser');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/users');

var app = express();


app.use(bodyParser.json());

app.post('/todo', (req,res) => {
  var todo = new Todo({
      text: req.body.text
  });

  todo.save().then((doc) => {
      res.send(doc);
  }, (e) => {
      res.status(400).send(e);
  });
});

//app.get('/')




app.listen(3000, () => {
    console.log('Started on port 3000');
});





//
// var newTodo = new Todo({
//     text: "Costco Shopping",
//     completed: false,
//     completedAt: new Date().getDate()
//
// })
//
// newTodo.save().then((doc) => {
//  console.log("Save ToDo", doc)
// }, (e) =>{
//     console.log("Unable to save Todo")
//
// });




// var newUser = new user({
//     email: "suman@gmail.com"
// })
//
//
// newUser.save().then((doc) => {
//     console.log("User saved", doc);
// },(e) =>{
//     console.log("Unable to create user", e);
// })

