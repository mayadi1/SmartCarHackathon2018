const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CarSchema = new Schema({
    name: {type: String, required: true},
    lender: {type: String, required: false},
});


// Export the model
module.exports = mongoose.model('Car', CarSchema);