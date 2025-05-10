const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const genderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    school: {
      type: ObjectId,
      ref: "School",
      required: true,
    },
    session: {
      type: ObjectId,
      ref: "Session",
      required: true,
    },
    level: {
      type: ObjectId,
      ref: "Level",
      required: true,
    },
    classes: {
      type: [ObjectId],
      ref: "Class",
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
module.exports = mongoose.model("Gender", genderSchema);
