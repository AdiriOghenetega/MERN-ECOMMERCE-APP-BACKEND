const { Router } = require("express");
const passport = require("passport");
const {handleSignUp,handleMobileSignUp,handleLogin,handleUserCheck,handleChangeRole} = require("../controllers/userctrl")

const router = Router();

//sign up
router.post("/signup",handleSignUp);

//mobile app sign up
router.post("/mobilesignup",handleMobileSignUp);

//api login
router.post("/login",handleLogin);

//check if user is logged in
router.get("/user/:id",handleUserCheck);


//change user role
router.put("/changeuserrole/:id",handleChangeRole)



module.exports = router;
