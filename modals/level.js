const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const levelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
    },
    register: {
      type: ObjectId,
      ref: "Register",
      // required: true,
    },
    session: {
      type: ObjectId,
      ref: "Session",
      required: true,
    },
    school: {
      type: ObjectId,
      ref: "School",
      required: true,
    },
    gender: {
      type: [ObjectId],
      ref: "Gender",
    },
    createdBy: {
      type: ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Level", levelSchema);
