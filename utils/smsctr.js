const twilio = require("twilio");

const sendSms = async (data) => {
  const accountSid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  await client.messages
    .create({
      from: process.env.TWILIO_FROM_NUMBER,
      to: `+234${data.to}`,
      body: data.body,
    })
    .then((message) => console.log(message.sid))
    .catch((error) => console.log(error));
};

module.exports = sendSms;
