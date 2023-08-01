const cloudinary = require("../utils/uploadImage");
const { sendPushNotification } = require("../utils/expo");
const sendEmail = require("../utils/emailctr");
const sendSms = require("../utils/smsctr");

//import schemas
const userModel = require("../database/schemas/user");
const orderModel = require("../database/schemas/order");
const guestModel = require("../database/schemas/guest");
const riderModel = require("../database/schemas/rider");

const handleGetOrders = async (req, res) => {
  console.log("getting orders");

  try {
    //query db and return order list
    const orderList = await orderModel
      .find()
      .populate("user")
      .populate("guest");

    if (!orderList) {
      res.send({ message: "No Orders listed" });
    } else {
      //send orderList as response
      res.send({ data: orderList });
      console.log("orders sent");
    }
  } catch (error) {
    console.log(error);
  }
};

const handleGetClientOrders = async (req, res) => {
  console.log("getting orders");
  const { email } = req.query;
  try {
    //query db and return order list
    const orderList = await orderModel
      .find({ email: email })
      .populate("user")
      .populate("guest");

    if (!orderList) {
      res.send({ message: "No Orders listed" });
    } else {
      //send orderList to client as response
      res.send({ data: orderList });
      console.log("orders sent");
    }
  } catch (error) {
    console.log(error);
  }
};

const handleCreateOrder = async (req, res) => {
  const {
    amount,
    userID,
    userType,
    guest,
    method,
    payment_status,
    order_status,
    reference,
    cartData,
    location,
    deliveryLocation,
    email,
    vat,
    subTotal,
    deliveryCharge,
    expoPushToken,
  } = req.body;

  try {
    if (userType === "registered") {
      if (
        amount &&
        userID &&
        method &&
        payment_status &&
        order_status &&
        cartData &&
        reference &&
        location &&
        deliveryLocation &&
        email &&
        vat &&
        subTotal &&
        deliveryCharge
      ) {
        console.log("create order called");
        //check for user
        const userExists = await userModel.findById(userID);
        if (userExists) {
          //create/store order in db
          const orderdb = await orderModel.create({
            user: userID,
            paymentMethod: method,
            paymentStatus: payment_status,
            orderStatus: order_status,
            transactionReference: reference,
            amount,
            cart: cartData,
            location,
            deliveryLocation,
            email,
            vat,
            subTotal,
            deliveryCharge,
            expoPushToken,
          });

          //find current client's order and send together with current orderDB as res
          const clientOrderDb = await orderModel
            .find({ email: email })
            .populate("user");
          console.log("order created");
          res.send({ orderList: clientOrderDb, currentOrder: orderdb });
        } else {
          res.send({ message: "user does not exist" });
        }
      } else {
        res.send({ message: "incomplete required details" });
      }
    } else if (userType === "guest") {
      if (
        amount &&
        guest &&
        method &&
        payment_status &&
        order_status &&
        cartData &&
        reference &&
        location &&
        deliveryLocation &&
        vat &&
        subTotal &&
        deliveryCharge
      ) {
        //check for guest
        const guestExists = await guestModel.findOne({ email: guest.email });
        if (guestExists) {
          //create/store order in db
          const orderdb = await orderModel.create({
            guest: guestExists._id,
            paymentMethod: method,
            paymentStatus: payment_status,
            orderStatus: order_status,
            transactionReference: reference,
            amount,
            cart: cartData,
            location,
            deliveryLocation,
            email: guest.email,
            vat,
            subTotal,
            deliveryCharge,
            expoPushToken,
          });
          //find current client's order and send together with current orderDB as res
          const clientOrderDb = await orderModel
            .find({ email: guest.email })
            .populate("guest");
          res.send({ orderList: clientOrderDb, currentOrder: orderdb });
        } else {
          //create guest in db
          const { firstName, lastName, email, mobile, address } = guest;
          const newGuest = await guestModel.create({
            firstName,
            lastName,
            mobile,
            email,
            address,
          });

          //now create order in db
          const orderdb = await orderModel.create({
            guest: newGuest._id,
            paymentMethod: method,
            paymentStatus: payment_status,
            orderStatus: order_status,
            transactionReference: reference,
            amount,
            cart: cartData,
            location,
            address: address,
            deliveryLocation,
            email: guest.email,
            vat,
            subTotal,
            deliveryCharge,
            expoPushToken,
          });
          //find current client's order and send together with current orderDB as res
          const clientOrderDb = await orderModel
            .find({ email: guest.email })
            .populate("guest");
          res.send({ orderList: clientOrderDb, currentOrder: orderdb });
        }
      } else {
        res.send({ message: "incomplete required details" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const handleUpdateOrderStatus = async (req, res) => {
  console.log("update order called");
  const { orderStatus } = req.body;
  const { user_id, order_id } = req.query;
  try {
    if (user_id && order_id) {
      //find user with ID and check if user is an admin
      const isAdmin = await userModel.findById(user_id);
      if (isAdmin && (isAdmin.role.toLowerCase() === "admin" || isAdmin.role?.toLowerCase() === "super_admin")) {
        //find order with id and update status
        await orderModel.findByIdAndUpdate(
          order_id,
          { orderStatus: orderStatus },
          { new: true }
        );
        //find order with id and retrieve expoPushToken
        const clientOrder = await orderModel.findById(order_id);
        const expoPushToken = clientOrder.expoPushToken;
        const clientOrderStatus = clientOrder.orderStatus;
        //now send push notification to client
        expoPushToken &&
          sendPushNotification(
            [expoPushToken],
            "Order Delivered. click to monitor order in app",
            clientOrderStatus,
            "OrderList"
          );

        //find order Db
        const orderdb = await orderModel.find();
        res.send({ data: orderdb });
        console.log("updated order sent");
      } else {
        res.send({ message: "only admins can perform this action" });
      }
    } else {
      res.send({ message: "only admins can perform this action" });
    }
  } catch (error) {
    console.log(error);
  }
};

const initiateDelivery = async (req, res) => {
  console.log("initiate order delivery called");
  const { riderDetails } = req.body;
  const { name, mobile, image } = riderDetails;
  const { user_id, order_id } = req.query;
  try {
    if (user_id && order_id) {
      //find user with ID and check if user is an admin
      const isAdmin = await userModel.findById(user_id);
      if (isAdmin && (isAdmin.role.toLowerCase() === "admin" || isAdmin.role?.toLowerCase() === "super_admin")) {
        //check if rider already exists
        const riderExists = await riderModel.findOne({
          mobile: mobile.toString(),
        });
        let imageUpload = {};
        if (riderExists?.mobile) {
          imageUpload = image;
        } else {
          imageUpload =
            image &&
            (await cloudinary.uploader.upload(image, {
              folder: "Hcue",
              timeout: 60000,
            }));

          const newRider = await riderModel.create({
            name,
            mobile,
            image: imageUpload?.secure_url,
          });
          console.log("created new rider", newRider);
        }
        //find order with id and update status
        await orderModel.findByIdAndUpdate(
          order_id,
          {
            rider: {
              name,
              mobile,
              image: riderExists ? image : imageUpload?.secure_url,
            },
            orderStatus: "delivering",
          },
          { new: true }
        );
        //find order with id and retrieve expoPushToken
        const clientOrder = await orderModel.findById(order_id);
        const expoPushToken = clientOrder.expoPushToken;
        const clientOrderStatus = clientOrder.orderStatus;
        //now send push notification to client
        expoPushToken &&
          sendPushNotification(
            [expoPushToken],
            "Order Sent,Delivery in progress. click to monitor order in app",
            clientOrderStatus,
            "OrderList"
          );

        //send email to client
        const clientEmail = clientOrder?.email;
        clientEmail &&
          sendEmail({
            to: clientEmail,
            subject: "Order Enroute",
            text: "Your order has been fulfilled and is on its way.Refresh orderlist and click on order to access rider details",
            htm: `<p style={{backgroundColor:"rgb(233,142,30)",color:"white",fontWeight:"bold",padding:"4px"}}>Your order has been fulfilled and is on its way. Refresh orderlist on app or website and click on order to access rider details.Enjoy your meal </p>`,
          });

        //send sms to client
        const clientDB = await userModel.findById(clientOrder?.user)
        const guestDB = await guestModel.findById(clientOrder?.user)
        const clientMobile = clientDB?.mobile ? clientDB?.mobile:guestDB?.mobile
        clientMobile &&
          sendSms({
            to: clientMobile.slice(1),
            body: "Your order has been fulfilled and is on its way. Refresh orderlist on app or website and click on order to access rider details.Enjoy your meal",
          });

        //find order Db
        const orderdb = await orderModel.find();
        res.send({ data: orderdb });
        console.log("updated order sent");
      } else {
        res.send({ message: "only admins can perform this action" });
      }
    } else {
      res.send({ message: "only admins can perform this action" });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleOrderPaymentStatus = async (req, res) => {
  console.log("update order payment called");
  const { paymentStatus } = req.body;
  const { transactionReference } = req.query;

  try {
    if (transactionReference) {
      orderModel.updateOne(
        { transactionReference: transactionReference },
        { paymentStatus: paymentStatus },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated Docs : ", docs);
          }
        }
      );

       //find order with id and retrieve expoPushToken
        const clientOrder = await orderModel.findOne({ transactionReference: transactionReference });
        const expoPushToken = clientOrder.expoPushToken;
        const clientPaymentStatus = clientOrder.paymentStatus;
        //now send push notification to client
        expoPushToken &&
          sendPushNotification(
            [expoPushToken],
            "Order Placed. Order status pending",
            clientPaymentStatus,
            "OrderList"
          );


      //find order Db
      const orderdb = await orderModel.find();
      res.send({ data: orderdb });
      console.log("updated order sent");
    } else {
      res.send({ message: "transaction reference not recognised" });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteOne = async (req, res) => {
  const { user_id, order_id } = req.query;
  try {
    if (user_id && order_id) {
      //find user with ID and check if user is an admin
      const isAdmin = await userModel.findById(user_id);
      if (isAdmin && (isAdmin.role.toLowerCase() === "admin" || isAdmin.role?.toLowerCase() === "super_admin")) {
        //find order with id and delete
        await orderModel.findByIdAndDelete(order_id);

        //find order Db and send
        const orderdb = await orderModel.find();
        res.send({ data: orderdb });
      } else {
        res.send({ message: "only admins can perform this action" });
      }
    } else {
      res.send({ message: "only admins can perform this action" });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteAll = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      //find user with ID and check if user is an admin
      const isAdmin = await userModel.findById(id);
      if (isAdmin && (isAdmin.role.toLowerCase() === "admin" || isAdmin.role?.toLowerCase() === "super_admin")) {
        await orderModel.deleteMany({});
        //find order Db and send
        const orderdb = await orderModel.find();
        res.send({ data: orderdb });
      } else {
        res.send({ message: "only admins can perform this action" });
      }
    } else {
      res.send({ message: "only admins can perform this action" });
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  handleGetOrders,
  handleGetClientOrders,
  handleCreateOrder,
  handleUpdateOrderStatus,
  handleDeleteOne,
  handleDeleteAll,
  handleOrderPaymentStatus,
  initiateDelivery,
};
