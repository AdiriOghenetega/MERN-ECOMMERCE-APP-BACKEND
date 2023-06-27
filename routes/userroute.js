const { Router } = require("express");
const passport = require("passport");
const {handleSignUp,handleMobileSignUp,handleLogin,handleUserCheck,handleChangeRole} = require("../controllers/userctrl")

const router = Router();

const multer = require('multer');

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('invalid image file!', false);
  }
};
const uploads = multer({ storage, fileFilter });

//sign up
router.post("/signup",handleSignUp);

//mobile app sign up
router.post("/mobilesignup",uploads.single('image'),handleMobileSignUp);

//api login
router.post("/login",handleLogin);

//check if user is logged in
router.get("/user/:id",handleUserCheck);


//change user role
router.put("/changeuserrole/:id",handleChangeRole)



module.exports = router;
