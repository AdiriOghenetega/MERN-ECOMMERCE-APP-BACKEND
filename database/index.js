const mongoose = require("mongoose")
require("dotenv").config();

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log("connected to db"))
.catch(err => console.log(err));