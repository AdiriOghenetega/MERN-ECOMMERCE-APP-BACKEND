const { Router } = require("express");
const { handlePayment,handleVerifyTransaction } = require("../controllers/paystackctrl")

const router = Router();

router.get("/payment",handlePayment );
router.get("/verifypayment",handleVerifyTransaction)

module.exports = router;