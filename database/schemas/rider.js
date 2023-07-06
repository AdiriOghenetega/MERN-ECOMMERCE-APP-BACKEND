const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var riderSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        index:true,
    },
    mobile:{
        type:String,
        required:true,
    },
   image:{
        type:String,
    },
});

//Export the model
module.exports = mongoose.model('rider', riderSchema);