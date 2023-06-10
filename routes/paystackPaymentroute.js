const { Router } = require("express");
const { handlePayment } = require("../controllers/paystackctrl")

const router = Router();

router.get("/payment",handlePayment );


module.exports = router;