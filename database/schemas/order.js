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
    },
    transactionReference:{
        type:String,
        required:true
    },
    amount:Number
}
,
{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);