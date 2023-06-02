const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique:true,
    },
    paymentMethod:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:String,
        required:true,
    },
    orderStatus:{
        type:String,
        required:true
    }
}
,
{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);