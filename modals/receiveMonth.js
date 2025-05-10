const { Schema, model } = require("mongoose");
const { ObjectId } = Schema;

const monthSchema = new Schema(
  {
    voucher: [],
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
  },
  {
    timestamps: true,
  }
);
module.exports = model("ReceiveMonths", monthSchema);
