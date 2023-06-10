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
const cartRouter = require("./routes/cartroute")
const orderRouter=require("./routes/orderroute")
const paystackRouter=require("./routes/paystackPaymentroute")

const app = express();
app.use(cors({
  origin: ["http://localhost:3000","https://checkout.paystack.com"],
  credentials:true
}));
app.use(express.json({ limit: "50mb" }));

const PORT = process.env.PORT || 3001;



//mongodb connection
require("./database/index");
require("./strategies/local")



app.use(cookieParser())
app.use(session({
  store: MongoStore.create({ mongoUrl:process.env.MONGODB_URI}),
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
app.use("",cartRouter)
app.use("",orderRouter)
app.use("",paystackRouter)

//server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));
