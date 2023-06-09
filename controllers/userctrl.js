const passport = require("passport");
const { hashPassword } = require("../utils/helper");
const cloudinary = require("../utils/uploadImage");

//import schema
const userModel = require("../database/schemas/user");
const cartModel = require("../database/schemas/cart");
const orderModel = require("../database/schemas/order")

const handleSignUp = async (req, res) => {
  const { email, firstName, lastName, image, address, mobile } = req.body;
  try {
    const userExist = await userModel.findOne({ email: email });

    if (userExist) {
      res.send({ message: "Email id is already registered", alert: false });
    } else {
      const passwordHash = hashPassword(req.body.password);
      const imageUpload =
        image &&
        (await cloudinary.uploader.upload(image, {
          folder: "Hcue",
          timeout: 60000,
        }));

      await userModel.create({
        email,
        mobile,
        password: passwordHash,
        firstName,
        lastName,
        address,
        image: imageUpload?.secure_url,
      });

      res.send({ message: "Sign-up Successfully", alert: true });
    }
  } catch (error) {
    console.error("Error occurred: ", error);
  }
};

const handleMobileSignUp = async (req, res) => {
  console.log("handle mobile signup called");
console.log(req.file)
  const { email, firstName, lastName, address, mobile } = req.body;
  try {
    const userExist = await userModel.findOne({ email: email });

    if (userExist) {
      res.send({ message: "Email id is already registered", alert: false });
    } else {
      const passwordHash = hashPassword(req.body.password);
      const imageUpload =
        req.file &&
        (await cloudinary.uploader.upload(req.file.path, {
          folder: "Hcue",
          timeout: 60000,
        }));

      await userModel.create({
        email,
        mobile,
        password: passwordHash,
        firstName,
        lastName,
        address,
        image:imageUpload?.url
      });

      res.send({ message: "Sign-up Successfully", alert: true });
    }
  } catch (error) {
    console.error("Error occurred: ", error);
  }
};

const handleLogin = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) res.send({ message: err });
    if (!user) res.send({ message: info?.message });
    else {
      req.logIn(user, async (err) => {
        if (err) res.send({ message: err });
        //check for user's cartDB if user has existing cart
        let cartDB = [];
        try {
          if (user.cart) {
            cartDB = await cartModel.findById(user.cart);
          }
        //check for user's order data,if any exists , send by res
       const orderDB = await orderModel.find({email:user.email})

          res.send({
            message: `Welcome ${user.firstName} Login is successfully`,
            alert: true,
            data: user,
            cart: cartDB.cart ? cartDB.cart : [],
            orderList: orderDB ? orderDB:[]
          });
        } catch (error) {
          console.log(error);
        }
      });
    }
  })(req, res, next);
};

const handleUserCheck = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    if (id) {
      const userDb = await userModel.findById(id);
      //check for user's order data,if any exists , send by res
      if (userDb) {
        const orderDB = await orderModel.find({email:userDb.email})
        res.send({
          data: userDb,
          orderList: orderDB ? orderDB:[]
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const handleChangeRole = async (req, res) => {
  const { user_email, role,location } = req.body;
  const { id } = req.params;
  try {
    //check if user is admin
    const user = await userModel.findById(id);
    if (user && (user?.role?.toLowerCase() === "super_admin")) {
      //check for second user with email and update
      const secondUser = await userModel.findOneAndUpdate(
        { email: user_email },
        { role,location }
      );
      res.send({ message: "user role updated" });
    } else {
      res.send({ message: "you're not authorized,only super admins can perform this action" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleSignUp,
  handleMobileSignUp,
  handleLogin,
  handleUserCheck,
  handleChangeRole,
};
