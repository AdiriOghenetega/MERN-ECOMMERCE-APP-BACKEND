const mongoose = require("mongoose")

const schemaProduct =new mongoose.Schema({
    name: String,
    category:String,
    image: String,
    price: String,
    description: String,
    stores : Array,
  });


  module.exports = mongoose.model("product",schemaProduct)