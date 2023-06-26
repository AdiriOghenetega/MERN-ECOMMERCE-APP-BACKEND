const {Router}=require("express")
const {handleGetOrders,handleCreateOrder,handleUpdateOrderStatus,handleOrderPaymentStatus,handleDeleteOne,handleDeleteAll} = require("../controllers/orderctrl")

const router = Router()

router.get("/getorders",handleGetOrders)

router.post("/createorder",handleCreateOrder)

router.put("/updateorder",handleUpdateOrderStatus)

router.put("/updatepaymentstatus",handleOrderPaymentStatus)

router.delete("/deleteone",handleDeleteOne)

router.delete("/deleteall/:id",handleDeleteAll)

module.exports = router