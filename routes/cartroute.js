const {Router} = require("express")
const userModel = require("../database/schemas/user")

const router = Router()

router.put("/addCart/:id",async(req,res)=>{
    const {id}=req.params
    console.log(id)
  
    //check for user
   const userDb = await userModel.findById(id)
   //add cart to userDb if it exists
   if(userDb){
    await userModel.updateOne({_id:id},{cart: req.body})
       res.send({message:"cart added to database"})
   }else{
    console.log("user not found")
   }

})

router.get("/getcart",(req,res)=>{
    console.log(req.session)
    const {cart} = req.session
    if(cart){
        res.send(cart)
    }else{
        res.send("Cart is empty")
    }
})

module.exports = router