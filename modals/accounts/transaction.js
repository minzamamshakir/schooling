const { Schema, model } = require("mongoose");
const { ObjectId } = Schema;

const transactionSchema = new Schema(
  {
    school: {
      type: ObjectId,
      ref: "School",
    },
    session: {
      type: ObjectId,
      ref: "Session",
    },
    transactionType: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    inTermsOf: {
      type: ObjectId,
      ref: "InTermsOf",
      required: true,
    },
    amount: {
      type: Number,
      positive: true,
      required: true,
    },
    voucherNo: {
      type: ObjectId,
      ref: "StudentsFee",
    },
    salary: {
      type: ObjectId,
      ref: "Salary",
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
module.exports = model("Transaction", transactionSchema);
