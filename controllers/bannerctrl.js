const cloudinary = require("../utils/uploadImage");

//import schemas
const userModel = require("../database/schemas/user")
const bannerModel = require("../database/schemas/banner")

const handleGetBanner = async(req,res)=>{
    try{
        //query banner list
        const bannerList = await bannerModel.find()
       
        res.send({data:bannerList,message:"banner uploaded"})
    }catch(error){
        console.log(error)
    }
}

const handleCreateBanner = async(req,res)=>{
    console.log("createbanner called")
    const {image} = req.body
    const {id} = req.params
    try{
        if(id){
            //find user with ID and check if user is an admin
          const isAdmin = await userModel.findById(id)
          if(isAdmin && (isAdmin.role?.toLowerCase() === "super_admin")){
             if(image){
                const imageUpload = await cloudinary.uploader.upload(image, {
                    folder: "Hcue",
                    timeout: 60000,
                  });

                //create banner
                const banner = await bannerModel.create({
                    image : imageUpload?.secure_url
                })

                //query banner list
                const bannerList= await bannerModel.find()
                res.send({data:bannerList,message:"banner uploaded"})
             }else{
                res.send({message: "upload failed,no image file recieved"})
             }
          }else{
            res.send({message:"Sorry only super admins can perform this action"})
          }
        }else{
            res.send({message:"Sorry only super admins can perform this action"})
        }
    }catch(err){
        console.log(err)
    }
}

module.exports = {handleCreateBanner,handleGetBanner}