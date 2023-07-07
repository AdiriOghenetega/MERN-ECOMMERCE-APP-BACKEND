
//import schemas
const riderModel = require("../database/schemas/rider")


const handleGetRider = async(req,res)=>{
    try{
        //query rider list
        const riderList = await riderModel.find()
       
        res.send({data:riderList})
    }catch(error){
        console.log(error)
    }
}


module.exports = {handleGetRider}