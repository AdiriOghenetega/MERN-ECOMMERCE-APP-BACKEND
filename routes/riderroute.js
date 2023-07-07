const {Router} = require("express")
const {handleGetRider}=require("../controllers/riderctrl")

const router = Router()

//get riders
router.get("/getriders",handleGetRider)


module.exports = router