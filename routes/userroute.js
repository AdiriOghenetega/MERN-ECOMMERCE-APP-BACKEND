const {Router} = require("express")
const passport = require("passport")
const {hashPassword}= require("../utils/helper")
const cloudinary = require("../utils/uploadImage")

//import schema
const userModel = require("../database/schemas/user");
const cartModel = require("../database/schemas/cart")

const router = Router()


//sign up
router.post("/signup", async (req, res) => {
  
    const { email,firstName,lastName,image,address } = req.body;
  
    const userExist = await userModel.findOne({ email: email });
   
      if (userExist) {
        res.send({ message: "Email id is already register", alert: false });
      } else {
        const passwordHash = hashPassword(req.body.password)
        const imageUpload =image && await cloudinary.uploader.upload(image,{
          folder:"Hcue"
        })
        await userModel.create({
          email,
          password: passwordHash,
          firstName,
          lastName,
          address,
          image:imageUpload?.secure_url
        });
        
        res.send({ message: "Sign-up Successfully", alert: true });
      }
    
  });
  
  //api login
  
  router.post("/login",passport.authenticate('local'),async (req,res)=>{
    console.log("logged in")
    const {user} = req

    //check for user's cartDB if user has existing cart
    let cartDB = []
    if(user.cart){
      cartDB = await cartModel.findById(user.cart)
    }
    
    
    res.send({
      message: `Welcome ${user.firstName} Login is successfully`,
      alert: true,
      data:user,
      cart:cartDB.cart ? cartDB.cart : []
    });
  })
  
 
  //check if user is logged in
  router.get("/user/:id",async(req,res)=>{
    const {id} = req.params
    console.log(id)
    if(id){
      const userDb = await userModel.findById(id)
      if(userDb){
        res.send(userDb)
      }
    }
  })


module.exports = router