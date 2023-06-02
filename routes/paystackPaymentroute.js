const https = require('https')
const {Router}=require("express")
const dotenv=require("dotenv").config()
const userModel=require("../database/schemas/user")
const cartModel=require("../database/schemas/cart")


const router = Router()

router.get("/payment",async(req,res)=>{
console.log("payment api called")

    const {id,amount}=req.query
console.log(id,amount)
//check for user
const userDB = await userModel.findById(id)
//check for cart if user exists
if(userDB){
    const cartDB = await cartModel.findById(userDB.cart)
    //if cartDB exists and has length greater than zero ,use info from cart and user to give info to payment gateway
    if(cartDB && (cartDB?.cart?.length > 0)){
        const params = JSON.stringify({
            "email": userDB?.email,
            "amount": amount * 100
          })
          
          const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.PAY_STACK_SECRET_KEY}`,
              'Content-Type': 'application/json'
            }
          }
          
          const reqPaystack = https.request(options, resPaystack => {
            let data = ''
          
            resPaystack.on('data', (chunk) => {
              data += chunk
            });
          
            resPaystack.on('end', () => {
              res.send(JSON.parse(data))
            })
          }).on('error', error => {
            res.send(error)
          })
          
          reqPaystack.write(params)
          reqPaystack.end()
    }
}
})

module.exports=router