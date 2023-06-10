//import schemas
const userModel = require("../database/schemas/user")
const orderModel = require("../database/schemas/order")

const handleGetOrders = async(req,res)=>{
    console.log("getting orders")
    
    try{
    

      //query db and return order list
      const orderList = await orderModel.find().populate("user")
      console.log(orderList)
      if(!orderList){
        res.send({message:"No Orders listed"})
      }else{
        //send orderList to client as response
        res.send({data : orderList})
        console.log("orders sent")

      }
    
  }catch(error){
    console.log(error)
  }
  }

const handleCreateOrder = async(req,res)=>{
    const {amount,userID,method,payment_status,order_status,reference,cartData,location}=req.body
   try{
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
   }catch(error){
    console.log(error)
   }
}

const handleUpdateOrder = async(req,res)=>{
    console.log("update order called")
  const {orderStatus}=req.body
  const {user_id,order_id} = req.query
  try{
    //find user with ID and check if user is an admin
    const isAdmin = await userModel.findById(user_id)
    if(isAdmin && (isAdmin.role.toLowerCase() === "admin")){
      //find order with id and update status
     await orderModel.findByIdAndUpdate(order_id,{orderStatus: orderStatus},{new:true})
      //find order Db
      const orderdb = await orderModel.find()
      res.send({data:orderdb})
      console.log("updated order sent")
    }else{
      res.send({message:"only admins can perform this action"})
    }
  }catch(error){
    console.log(error)
  }
  }

const handleDeleteOne = async(req,res)=>{
    const {user_id,order_id} = req.query
    try{
      //find user with ID and check if user is an admin
    const isAdmin = await userModel.findById(user_id)
    if(isAdmin && (isAdmin.role.toLowerCase() === "admin")){
      //find order with id and delete
     await orderModel.findByIdAndDelete(order_id)
     //find orderdb and send
   //find order Db and send
   const orderdb = await orderModel.find()
   res.send({data:orderdb})

    }else{
      res.send({message:"only admins can perform this action"})
    }
    }catch(error){
        console.log(error)
    }
  }

const handleDeleteAll = async(req,res)=>{
  const {id} = req.params
  try{
      //find user with ID and check if user is an admin
      const isAdmin = await userModel.findById(id)
      if(isAdmin && (isAdmin.role.toLowerCase() === "admin")){
        await orderModel.deleteMany({})
        //find order Db and send
        const orderdb = await orderModel.find()
        res.send({data : orderdb})
      }else{
        res.send({message:"only admins can perform this action"})
      }
    }catch(error){
        console.log(error)
    }
  }
module.exports = {handleGetOrders,handleCreateOrder,handleUpdateOrder,handleDeleteOne,handleDeleteAll}