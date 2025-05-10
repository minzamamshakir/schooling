const { Schema, model } = require("mongoose");
const { ObjectId } = Schema;

const monthSchema = new Schema(
  {
    month: {
      jan: { type: Boolean, default: false },
      feb: { type: Boolean, default: false },
      mar: { type: Boolean, default: false },
      apr: { type: Boolean, default: false },
      may: { type: Boolean, default: false },
      jun: { type: Boolean, default: false },
      jul: { type: Boolean, default: false },
      aug: { type: Boolean, default: false },
      sep: { type: Boolean, default: false },
      oct: { type: Boolean, default: false },
      nov: { type: Boolean, default: false },
      dec: { type: Boolean, default: false },
    },
    session: {
      type: ObjectId,
      ref: "Session",
    },
    school: {
      type: ObjectId,
      ref: "School",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = model("Months", monthSchema);
