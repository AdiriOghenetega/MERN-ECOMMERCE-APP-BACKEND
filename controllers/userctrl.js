const passport = require("passport");
const { hashPassword } = require("../utils/helper");
const cloudinary = require("../utils/uploadImage");

//import schema
const userModel = require("../database/schemas/user");
const cartModel = require("../database/schemas/cart");

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

  const { email, firstName, lastName, image, address, mobile } = req.body;
  try {
    const userExist = await userModel.findOne({ email: email });

    if (userExist) {
      res.send({ message: "Email id is already registered", alert: false });
    } else {
      const passwordHash = hashPassword(req.body.password);
      const imageUpload =
        image &&
        (await cloudinary.uploader.upload(req.file.path, {
          folder: "Hcue",
          timeout: 60000,
        }));

        console.log(imageUpload)

      await userModel.create({
        email,
        mobile,
        password: passwordHash,
        firstName,
        lastName,
        address,
        image: imageUpload?.url,
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
          res.send({
            message: `Welcome ${user.firstName} Login is successfully`,
            alert: true,
            data: user,
            cart: cartDB.cart ? cartDB.cart : [],
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
      if (userDb) {
        res.send(userDb);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const handleChangeRole = async (req, res) => {
  const { user_email, role } = req.body;
  const { id } = req.params;
  try {
    //check if user is admin
    const user = await userModel.findById(id);
    if (user && user?.role.toLowerCase() === "admin") {
      //check for second user with email and update
      const secondUser = await userModel.findOneAndUpdate(
        { email: user_email },
        { role }
      );
      res.send({ message: "user role updated" });
    } else {
      res.send({ message: "you're not authorized" });
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
