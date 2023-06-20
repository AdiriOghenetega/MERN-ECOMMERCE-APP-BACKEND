const https = require("https");

//import schemas
const userModel = require("../database/schemas/user");
const cartModel = require("../database/schemas/cart");

const handlePayment = async (req, res) => {
  console.log("payment api called");

  const { amount,email } = req.query;
  console.log(email,amount);
  try {
    
        const params = JSON.stringify({
          email: email,
          amount: amount * 100,
        });

        const options = {
          hostname: "api.paystack.co",
          port: 443,
          path: "/transaction/initialize",
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PAY_STACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        };

        const reqPaystack = https
          .request(options, (resPaystack) => {
            let data = "";

            resPaystack.on("data", (chunk) => {
              data += chunk;
            });

            resPaystack.on("end", () => {
              res.send(JSON.parse(data));
            });
          })
          .on("error", (error) => {
            res.send(error);
          });

        reqPaystack.write(params);
        reqPaystack.end();
      
    
  } catch (error) {
    console.log(error);
  }
};

const handleVerifyTransaction = async (req,res)=>{
console.log("verification called")
  const {reference} = req.query

  console.log(reference)

const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: `/transaction/verify/${reference}`,
  method: 'GET',
  headers: {
    Authorization: `Bearer ${process.env.PAY_STACK_SECRET_KEY}`
  }
}

https.request(options, resPaystack => {
  let data = ''

  resPaystack.on('data', (chunk) => {
    data += chunk
  });

  resPaystack.on('end', () => {
    console.log(JSON.parse(data))
    res.send(JSON.parse(data))
  })
}).on('error', error => {
  console.error(error)
})
}

module.exports = { handlePayment,handleVerifyTransaction };
