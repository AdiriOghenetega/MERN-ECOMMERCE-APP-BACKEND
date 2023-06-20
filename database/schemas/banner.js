const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var bannerSchema = new mongoose.Schema({
    image : String
});

//Export the model
module.exports = mongoose.model('banner', bannerSchema);