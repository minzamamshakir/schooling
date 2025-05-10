const { Schema, model } = require("mongoose");
const { ObjectId } = Schema;

const registerSchema = new Schema({
  count: {
    type: Number,
    default: 0,
  },
  prefix: {
    type: String,
    required: true,
    unique: true,
  },
  level: {
    type: ObjectId,
    ref: "Level",
  },
  gender: {
    type: ObjectId,
    reg: "Gender",
  },
  name: {
    type: String,
  },
  school: {
    type: ObjectId,
    ref: "School",
  },
});

module.exports = model("Register", registerSchema);
