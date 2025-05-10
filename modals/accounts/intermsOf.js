const { Schema, model } = require("mongoose");
const { ObjectId } = Schema;

const inTermsOfSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    typeOfAmount: {
      type: String,
      required: true,
      enum: ["income", "expense", "studentCharges"],
    },
    enteredBy: {
      type: String,
      enum: ["Admin", "Staff"],
      required: true,
    },
    createdBy: {
      type: ObjectId,
      refPath: "enteredBy",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("InTermsOf", inTermsOfSchema);
