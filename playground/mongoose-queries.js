const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/users');

var id = '5a6ff0ed7572e92ff14a1159';

if  (!ObjectID.isValid(id)){
    console.log('ID Not Valid');
} else{
    Todo.findById('5a6ff0ed7572e92ff14a1159').then((todos) => {
        if(!todos){
            return console.log('User not found');
        }
        console.log("User by Id:", todos);
    }).catch((e) => console.log(e));
}

// Todo.remove({}).then((result) =>{
//   console.log(result);
// });

//Todo.findOneAndRemove({id})

Todo.findByIdAndRemove('5a6ff0ed7572e92ff14a1159').then((todo)=>{
    console.log(todo);
})