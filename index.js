const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser")
const session = require('express-session')
const MongoStore = require('connect-mongo')

const passport = require("passport")
const userRouter = require("./routes/userroute")
const productRouter = require("./routes/productsroutes")
const paymentRouter = require("./routes/paymentroute")
const cartRouter = require("./routes/cartroute")

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials:true
}));
app.use(express.json({ limit: "50mb" }));

const PORT = process.env.PORT || 3001;



//mongodb connection
require("./database/index");
require("./strategies/local")



app.use(cookieParser())
app.use(session({
  store: MongoStore.create({ mongoUrl:'mongodb+srv://atdev:Mycollections1@cluster0.bz6rjbh.mongodb.net/user?retryWrites=true&w=majority'}),
  secret: 'Jamesbond008',
  resave: false,
  saveUninitialized: false,
}))


app.use(passport.initialize())
app.use(passport.session())



//api
app.get("/", (req, res) => {
  res.send("Server is running");
});

//use routes
app.use("",userRouter)
app.use("",productRouter)
app.use("",paymentRouter)
app.use("",cartRouter)


//server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));
