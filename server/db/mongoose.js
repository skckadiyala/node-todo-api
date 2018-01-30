/**
 * Created by kalyan on 1/29/18.
 */

var mongoose = require('mongoose');

mongoose.Promise= global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
    useMongoClient: true,
});


module.exports = {mongoose};
