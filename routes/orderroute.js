const {Router}=require("express")
const {handleGetOrders,handleGetClientOrders,handleCreateOrder,handleUpdateOrderStatus,handleOrderPaymentStatus,initiateDelivery,handleDeleteOne,handleDeleteAll} = require("../controllers/orderctrl")

const router = Router()

router.get("/getorders",handleGetOrders)

router.get("/getclientorders",handleGetClientOrders)

router.post("/createorder",handleCreateOrder)

router.put("/updateorder",handleUpdateOrderStatus)

router.put("/initiateorderdelivery",initiateDelivery)

router.put("/updatepaymentstatus",handleOrderPaymentStatus)

router.delete("/deleteone",handleDeleteOne)

router.delete("/deleteall/:id",handleDeleteAll)

module.exports = router