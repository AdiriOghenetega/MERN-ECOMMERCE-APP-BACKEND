const {Router} = require("express")
const {handleUpdateCart,handleGetCart} = require("../controllers/cartctrl")

const router = Router()

//update cart
router.put("/updatecart/:id",handleUpdateCart)

//get cart
router.get("/getcart/:id",handleGetCart)

module.exports = router