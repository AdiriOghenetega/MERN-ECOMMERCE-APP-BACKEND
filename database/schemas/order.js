const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    cart:{
        type: Array,
        required:true,
    },
    userType: String,
    guest:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"guest"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
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
    amount:Number,
    location: String,
    address : String
}
,
{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);