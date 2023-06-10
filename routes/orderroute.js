const {Router}=require("express")
const {handleGetOrders,handleCreateOrder,handleUpdateOrder,handleDeleteOne,handleDeleteAll} = require("../controllers/orderctrl")

const router = Router()

router.get("/getorders/:id",handleGetOrders)

router.post("/createorder",handleCreateOrder)

router.put("/updateorder",handleUpdateOrder)

router.delete("/deleteone",handleDeleteOne)

router.delete("/deleteall/:id",handleDeleteAll)

module.exports = router