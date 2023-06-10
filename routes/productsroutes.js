const { Router } = require("express");
const {handleProductUpload,handleGetProduct,handleTurnOffProduct,handleTurnOnProduct} = require("../controllers/productctrl")

const router = Router();

//product section

//save product in data
//api
router.post("/uploadProduct/:id",handleProductUpload);

//get product data
router.get("/product",handleGetProduct);

//turn off product availability
router.post("/product/turnoffproduct/:id", handleTurnOffProduct);

//turn on product availability
router.post("/product/turnonproduct/:id",handleTurnOnProduct);

module.exports = router;