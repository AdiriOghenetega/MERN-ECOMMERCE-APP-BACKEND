const mongoose = require("mongoose")

//userschema
const userSchema =new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    mobile:{
        type:String,
        required:true,
    },
    address: String,
    password: String,
    confirmPassword: String,
    image: String,
    role:{
      type:String,
      default:'user'
    },
    cart: mongoose.Schema.Types.ObjectId
  },{
    timestamps : true
  });
  
  //
  module.exports = mongoose.model("user", userSchema);