const smsHandler = require("./sms");
const constants = require("./constant");

smsHandler(
  "3037519135",
  {
    stdName: "masood",
    location: "202 R-B Gatti East, Faisalabad",
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString("en-PK", {
      timeZone: "Asia/Karachi",
    }),
  },
  constants.Present
);
