const {Router} = require("express")
const passport = require("passport")
const {hashPassword}= require("../utils/helper")

//import schema
const userModel = require("../database/schemas/user");

const router = Router()


//sign up
router.post("/signup", async (req, res) => {
  
    const { email,firstName,lastName,image } = req.body;
  
    const userExist = await userModel.findOne({ email: email });
   
      if (userExist) {
        res.send({ message: "Email id is already register", alert: false });
      } else {
        const passwordHash = hashPassword(req.body.password)
        await userModel.create({
          email,
          password: passwordHash,
          firstName,
          lastName,
          image
        });
        
        res.send({ message: "Sign-up Successfully", alert: true });
      }
    
  });
  
  //api login
  
  router.post("/login",passport.authenticate('local'),async (req,res)=>{
    console.log("logged in")
    const {user} = req
    
    res.send({
      message: `Welcome ${user.firstName} Login is successfully`,
      alert: true,
      data:user,
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