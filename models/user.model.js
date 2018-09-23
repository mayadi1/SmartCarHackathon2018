const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CarSchema = new Schema({
    name: {type: String, required: true},
    lender: {type: String, required: false},
});

let UserSchema = new Schema({
    name: {type: String, required: true, max: 100},
    password: {type: String, required: true},
    cars: [CarSchema]
});


// Export the model
module.exports = mongoose.model('User', UserSchema);