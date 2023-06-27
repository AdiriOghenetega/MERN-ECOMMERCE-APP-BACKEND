const { Router } = require("express");
const {
  handleSignUp,
  handleMobileSignUp,
  handleLogin,
  handleUserCheck,
  handleChangeRole,
} = require("../controllers/userctrl");
const uploads = require("../utils/multer");

const router = Router();

//sign up
router.post("/signup", handleSignUp);

//mobile app sign up
router.post("/mobilesignup", uploads.single("image"), handleMobileSignUp);

//api login
router.post("/login", handleLogin);

//check if user is logged in
router.get("/user/:id", handleUserCheck);

//change user role
router.put("/changeuserrole/:id", handleChangeRole);

module.exports = router;
