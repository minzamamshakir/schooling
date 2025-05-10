const { Schema, model } = require("mongoose");
const { ObjectId } = Schema;

const LoanSchema = new Schema({
  monthTaken: {
    type: String,
    enum: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ],
    required: true,
  },
  staffId: {
    type: ObjectId,
    ref: "Staff",
  },
  session: {
    type: ObjectId,
    ref: "Session",
  },
  school: {
    type: ObjectId,
    ref: "School",
  },
  amount: {
    type: Number,
    required: true,
  },
  remaining: {
    type: Number,
    required: true,
  },
  deductAmount: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
});

module.exports = model("Loan", LoanSchema);
