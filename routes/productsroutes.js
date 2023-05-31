const {Router} = require("express")
const passport = require("passport")

//import schema
const productModel = require("../database/schemas/products");

const router = Router()

//product section

//save product in data
//api
router.post("/uploadProduct", async (req, res) => {
 
  const exists = await productModel.findOne({name: req.body.name})
  if(exists){
    res.send({message : "Product Already Listed"})
  }else{
    const data = await productModel(req.body);
     await data.save();
    res.send({ message: "Upload successfully" });
  }
  });
  
  //get product data
  router.get("/product", async (req, res) => {
   console.log("product api called")
    const data = await productModel.find();
    console.log("product call answered")
      res.send(JSON.stringify(data));
      console.log("product data sent")
  });

  //turn off product availability
  router.post("/product/turnoffproduct",(req,res)=>{
    const {location,products} = req.body
    if(location && products){
      products.forEach(async(el)=>{
        const product = await productModel.findById(el.value)
        const stores = product.stores
        console.log(stores)
        await productModel.updateOne({_id:product._id},{stores: stores.filter(el=>el.toLowerCase() !== location.toLowerCase())})
      }) 
      res.send({message:"availability turned off"})
    }
  })

  //turn on product availability
  router.post("/product/turnonproduct",(req,res)=>{
    const {location,products} = req.body
    console.log(products)
    if(location && products){
      products.forEach(async(el)=>{
        const product = await productModel.findById(el.value)
        const stores = product.stores
        console.log(stores)
        if(!stores.includes(location)){
          await productModel.updateOne({_id:product._id},{stores: [...stores,location]})
        }
      })
       res.send({message:"availability turned on"})
    }
  })


module.exports = router