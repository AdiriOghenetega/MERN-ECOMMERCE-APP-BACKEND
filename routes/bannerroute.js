const {Router} = require("express")
const {handleCreateBanner,handleGetBanner}=require("../controllers/bannerctrl")

const router = Router()

//get banner
router.get("/getbanners",handleGetBanner)

//upload banner
router.post("/createbanner/:id",handleCreateBanner)


module.exports = router