const axios = require("axios");
module.exports = (to, data, event_id) => {
  let msg = "";
  switch (event_id) {
    case 101:
      msg = data;
      break;
    case 166:
      msg = `The Amount Rs ${data && data.rupees}/- has been recieved at GEC ${
        data && data.location
      } Date : ${data && data.date}`;
      break;
    case 165:
      msg = `${data && data.stdName} left for Home from GEC ${
        data && data.location
      } at ${data && data.time} Date : ${data && data.date}.`;
      break;
    case 164:
      msg = `${data && data.stdName} is Absent today from GEC ${
        data && data.location
      } Date : ${data && data.date}.`;
      break;
    case 163:
      msg = `${data && data.stdName} arrived at GEC ${
        data && data.location
      } at ${data && data.time} Date : ${data && data.date}.`;

      break;
    case 123:
      msg = `Ghazalia Educational Complex Your Email is  ${
        data && data.email
      }. Your Password is ${data && data.password}. Please visit ${
        data && data.portalAddress
      } to login.`;

      break;
  }

  return axios
    .post("https://smsprotal.ghazalians.com/api/sendSMS", {
      secret: process.env.SMS_SECRET,
      phone: to,
      message: msg,
    })
    .then((data) => {
      return data; // JSON data parsed by `data.json()` call
    })
    .catch((err) => {
      console.log(err);
    });
};
