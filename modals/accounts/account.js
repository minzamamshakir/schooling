const { Schema, model } = require("mongoose");
const { ObjectId } = Schema;

const accountSchema = new Schema(
  {
    school: {
      type: ObjectId,
      ref: "School",
    },
    session: {
      type: ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = model("Account", accountSchema);
