//import schemas
const userModel = require("../database/schemas/user");
const cartModel = require("../database/schemas/cart");

const handleUpdateCart = async (req, res) => {
  const { id } = req.params;
  try{
    //check for user
    const userDB = await userModel.findById(id);
  //add or update cart in cartDb if user exists
  if (userDB) {
    let cartDB = await cartModel.findById(userDB.cart);
    if (cartDB) {
      //update cartDB
      await cartDB.updateOne({ cart: req.body });
      //send response
      res.send({ message: "cart updated to database" });
    } else {
      //  create cartDB
      cartDB = await cartModel.create({
        user: id,
        cart: req.body,
      });
      //update cart in userDB
      userDB.cart = cartDB?._id;
      await userDB.save();
      res.send({ message: "cart created on db" });
    }
  } else {
    console.log("user not found");
  }}catch(error){
    console.log(error)
  }
};

const handleGetCart = async (req, res) => {
 try{
   //check for user
  const userDB = await userModel.findById(id);
  //get cartDB for user if user exisits
  if (userDB) {
    const cartDB = await cartModel.findById(userDB.cart);
    //fetch cart from cartDB
    if (cartDB) {
      res.send(cartDB.cart);
    } else {
      res.send({ message: "no cart exists for user" });
    }
  } else {
    res.send({ message: "user does not exisit" });
  }}catch(error){
    console.log(error)
  }
};

module.exports = { handleUpdateCart, handleGetCart };
