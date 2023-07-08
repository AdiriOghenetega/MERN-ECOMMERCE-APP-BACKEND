const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var guestSchema = new mongoose.Schema({
    firstName:{
        type:String,
        index:true,
    },
    lastName:{
        type:String,
        index:true,
    },
    email:{
        type:String,
    },
    mobile:{
        type:String,
    },
    address:{
        type:String,
    },
});

//Export the model
module.exports = mongoose.model('guest', guestSchema);