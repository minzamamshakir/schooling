const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const sessionScehma = new Schema(
  {
    school: {
      type: ObjectId,
      ref: "School",
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    annual: {
      type: Boolean,
      required: true,
    },
    level: {
      type: [ObjectId],
      ref: "Level",
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

module.exports = mongoose.model("Session", sessionScehma);
