const {SHA256} = require('crypto-js');


const {jwt} = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

var pass = 'abc123';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(pass, salt, (err, hash) => {
        console.log(hash);
    })
})



// jwt.sign
// jwt.verify
//
//
// var message = 'This is a message for test';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message} `);
// console.log(`Hash: ${hash} `);