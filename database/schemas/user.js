const mongoose = require("mongoose")

//userschema
const userSchema =new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    confirmPassword: String,
    image: String,
    cart:{
      type:Array,
      default:[]
    }
  });
  
  //
  module.exports = mongoose.model("user", userSchema);