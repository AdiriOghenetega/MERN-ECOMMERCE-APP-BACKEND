const { Router } = require("express");
const passport = require("passport");
const { hashPassword } = require("../utils/helper");
const cloudinary = require("../utils/uploadImage");
const asyncRetry = require('async-retry');
const {handleSignUp,handleLogin,handleUserCheck,handleChangeRole} = require("../controllers/userctrl")

//import schema
const userModel = require("../database/schemas/user");
const cartModel = require("../database/schemas/cart");

const router = Router();

//sign up
router.post("/signup",handleSignUp);

//api login

router.post("/login",passport.authenticate("local"),handleLogin);

//check if user is logged in
router.get("/user/:id",handleUserCheck);


//change user role
router.put("/changeuserrole/:id",handleChangeRole)



module.exports = router;
