const {Router}=require("express")
const userModel = require("../database/schemas/user")
const orderModel = require("../database/schemas/order")

const router = Router()

router.get("/getorders",async(req,res)=>{
  console.log("getting orders")
//query db and return order list
const orderList = await orderModel.find().populate("user")
//send orderList to client as response
res.send(orderList)
console.log("orders sent")
})

router.post("/createorder",async(req,res)=>{
    const {amount,userID,method,payment_status,order_status,reference,cartData,location}=req.body
    if(amount && userID && method && payment_status && order_status && cartData && reference && location){
        //check for user
      const userExists = await userModel.findById(userID)
      if(userExists){ 
        //create/store order in db
          const orderdb = await orderModel.create({
            user:userID,
            paymentMethod: method,
            paymentStatus:payment_status,
            orderStatus:order_status,
            transactionReference:reference,
            amount,
            cart:cartData,
            location
          })
          res.send(orderdb)
      }else{
        res.send({message:"user does not exist"})
      }
    }else{
        res.send({message:"incomplete required details"})
    }
})

router.put("/updateorder/:id",async(req,res)=>{
  console.log("update order called")
const {orderStatus}=req.body
const {id} = req.params
if(id){
    //find order with id and update status
   await orderModel.findByIdAndUpdate(id,{orderStatus: orderStatus},{new:true})
    //find order Db
    const orderdb = await orderModel.find()
    res.send(orderdb)
    console.log("updated order sent")
}else{
    res.send({message:"invalid order ID"})
}
})

router.delete("/deleteone/:id",async(req,res)=>{
  const {id} = req.params
  //find order with id and delete
  await orderModel.findByIdAndDelete(id)
  //find orderdb and send
//find order Db and send
const orderdb = await orderModel.find()
res.send(orderdb)
})

router.delete("/deleteall",async(req,res)=>{
  await orderModel.deleteMany({})
  //find order Db and send
  const orderdb = await orderModel.find()
  res.send(orderdb)
})

module.exports = router