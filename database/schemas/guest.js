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
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    address:{
        type:String,
        unique:true,
    },
});

//Export the model
module.exports = mongoose.model('guest', guestSchema);