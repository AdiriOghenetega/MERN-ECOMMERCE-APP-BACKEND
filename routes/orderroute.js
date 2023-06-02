const {Router}=require("express")
const userModel = require("../database/schemas/user")
const orderModel = require("../database/schemas/order")

const router = Router()

router.post("/createorder",async(req,res)=>{
    const {cart,user,method,payment_status,order_status}=req.body
    if(cart && user && method && payment_status && order_status){
        //check for user
      const userExists = await userModel.findById(user?._id)
      if(userExists){
        //create/store order in db
          const orderdb = await orderModel.create({
            cart:cart.populate(),
            user:user.populate(),
            paymentMethod: method,
            paymentStatus:payment_status,
            orderStatus:order_status
          })
          res.send(orderdb)
      }else{
        res.send({message:"user does not exist"})
      }
    }else{
        res.send({message:"incomplete required details"})
    }
})

router.put("updateorder",async(req,res)=>{
const {orderId}=req.body
if(orderId){
    //find order with id and update status
    const updatedOrder = await orderModel.findByIdAndUpdate(orderId,{orderStatus: "delivered"},{new:true})
    res.send(updatedOrder)
}else{
    res.send({message:"invalid order ID"})
}
})

module.exports = router