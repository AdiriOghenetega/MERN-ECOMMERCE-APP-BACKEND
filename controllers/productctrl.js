const cloudinary = require("../utils/uploadImage");


//import schema
const productModel = require("../database/schemas/products");
const userModel = require("../database/schemas/user");

const handleProductUpload = async (req, res) => {
  const { name, category, image, price, description, stores } = req.body;
  const { id } = req.params;
  try {
    if(id){

      //find user with ID and check if user is an admin
      const isAdmin = await userModel.findById(id);
      if (isAdmin && (isAdmin.role?.toLowerCase() === "super_admin")) {
        const exists = await productModel.findOne({ name: name });
        if (exists) {
          res.send({ message: "Product Already Listed" });
        } else {
          if (name && category && image && price && description && stores) {
            const imageUpload = await cloudinary.uploader.upload(image, {
              folder: "Hcue",
              timeout: 60000,
            });
  
            const storeList = stores.map((item) => item.value);
  
            const data = await productModel.create({
              name,
              category,
              image: imageUpload?.secure_url,
              price,
              description,
              stores: storeList,
            });
            res.send({ message: "Upload successfully", data });
          }
        }
      } else {
        res.send({ message: "Sorry only super admins can perform this action" });
      }
    }else{
      res.send({ message: "only admins can perform this action" });
    }
  } catch (error) {
    console.error("Error occurred: ", error);
  }
};

const handleGetProduct = async (req, res) => {
  console.log("product api called");
  try {
    const data = await productModel.find();
    console.log("product call answered");
    res.send(JSON.stringify(data));
    console.log("product data sent");
  } catch (error) {
    console.log(error);
  }
};

const handleTurnOffProduct = async (req, res) => {
  const { location, products } = req.body;
  const { id } = req.params;
  try {
    if(id){
      //find user with ID and check if user is an admin
      const isAdmin = await userModel.findById(id);
      if (isAdmin && (isAdmin.role.toLowerCase() === "admin" || isAdmin.role?.toLowerCase() === "super_admin")) {
        if (location && products) {
          products.forEach(async (el) => {
            const product = await productModel.findById(el.value);
            const stores = product.stores;
            console.log(stores);
            await productModel.updateOne(
              { _id: product._id },
              {
                stores: stores.filter(
                  (el) => el.toLowerCase() !== location.toLowerCase()
                ),
              }
            );
          });
          res.send({ message: "availability turned off" });
        }
      } else {
        res.send({ message: "only admins can perform this action" });
      }

    }else{
      res.send({ message: "only admins can perform this action" });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleTurnOnProduct = async (req, res) => {
  const { location, products } = req.body;
  const { id } = req.params;
  console.log(products);
  try {
    if(id){
      //find user with ID and check if user is an admin
      const isAdmin = await userModel.findById(id);
      if (isAdmin && (isAdmin.role.toLowerCase() === "admin" || isAdmin.role?.toLowerCase() === "super_admin")) {
        if (location && products) {
          products.forEach(async (el) => {
            const product = await productModel.findById(el.value);
            const stores = product.stores;
            console.log(stores);
            if (!stores.includes(location)) {
              await productModel.updateOne(
                { _id: product._id },
                { stores: [...stores, location] }
              );
            }
          });
          res.send({ message: "availability turned on" });
        }
      } else {
        res.send({ message: "only admins can perform this action" });
      }
    }else{
      res.send({ message: "only admins can perform this action" });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleProductDelete = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    if(id){
      //check if user is admin
      const isAdmin = await userModel.findById(id);
      if (isAdmin && (isAdmin.role?.toLowerCase() === "super_admin")) {
        //loop through data ,find by id and delete
        if (body) {
          body.forEach(async (elem) => {
            await productModel.findByIdAndDelete(elem.value);
          });
          //find product Db and send
          const productdb = await productModel.find();
          res.send({ data: productdb });
        }
      } else {
        res.send({ message: "Sorry only super admins can perform this action" });
      }

    }else{
      res.send({ message: "only admins can perform this action" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleProductUpload,
  handleGetProduct,
  handleTurnOffProduct,
  handleTurnOnProduct,
  handleProductDelete,
};