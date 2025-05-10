require("dotenv").config();
const logger = require("./config/logger");
const mongoose = require("mongoose");
exports.connectDB = () => {
  mongoose
    .connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((err, connection) => {
      logger.info("DB CONNECTED");
    });
};
