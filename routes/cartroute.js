const {Router} = require("express")
const userModel = require("../database/schemas/user")
const cartModel = require("../database/schemas/cart")

const router = Router()


router.put("/updatecart/:id",async(req,res)=>{
    const {id}=req.params
    //check for user
   const userDB = await userModel.findById(id)
   //add or update cart in cartDb if user exists
   if(userDB){
    let cartDB = await cartModel.findById(userDB.cart)
    if(cartDB){
        //update cartDB
        await cartDB.updateOne({cart:req.body})
        //send response
       res.send({message:"cart updated to database"})
    }else{
      //  create cartDB
     cartDB = await cartModel.create({
           user: id,
          cart: req.body
      })    
      //update cart in userDB
    userDB.cart= cartDB?._id
    await userDB.save()
      res.send({message:"cart created on db"})
    }
    
   }else{
    console.log("user not found")
   }
})

router.get("/getcart/:id",async(req,res)=>{
    //check for user
    const userDB = await userModel.findById(id)
    //get cartDB for user if user exisits
    if(userDB){
        const cartDB = await cartModel.findById(userDB.cart)
        //fetch cart from cartDB
        if(cartDB){
            res.send(cartDB.cart)
        }else{
            res.send({message:"no cart exists for user"})
        }
    }else{
        res.send({message:"user does not exisit"})
    }
    
})

module.exports = router