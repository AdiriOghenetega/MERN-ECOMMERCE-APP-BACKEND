const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    cart:{
        type:Array,
        default: [],
    }
});

//Export the model
module.exports = mongoose.model('Cart', cartSchema);