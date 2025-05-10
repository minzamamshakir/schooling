const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const currentSchema = new Schema({
  day: {
    type: Date,
  },
  month: {
    type: String,
  },
});

module.exports = model("Current", currentSchema);
