const {Router}=require("express")
const userModel = require("../database/schemas/user")
const orderModel = require("../database/schemas/order")

const router = Router()

router.get("/getorders",async(req,res)=>{
//query db and return order list
const orderList = await orderModel.find()
//send orderList to client as response
res.send(orderList)
})

router.post("/createorder",async(req,res)=>{
    const {amount,userID,method,payment_status,order_status,reference}=req.body
    if(amount && userID && method && payment_status && order_status){
        //check for user
      const userExists = await userModel.findById(userID)
      if(userExists){ 
        //create/store order in db
          const orderdb = await orderModel.create({
            cart:userExists?.cart,
            user:userExists,
            paymentMethod: method,
            paymentStatus:payment_status,
            orderStatus:order_status,
            transactionReference:reference,
            amount
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