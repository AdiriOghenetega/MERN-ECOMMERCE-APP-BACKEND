const mongoose = require("mongoose")
const dotenv = require("dotenv").config();

mongoose.set('strictQuery', false)
mongoose.connect("mongodb+srv://atdev:Mycollections1@cluster0.bz6rjbh.mongodb.net/user?retryWrites=true&w=majority")
.then(()=> console.log("connected to db"))
.catch(err => console.log(err));