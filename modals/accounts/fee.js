const { Schema, model } = require("mongoose");
const { ObjectId } = Schema;

const feeSchema = new Schema({
  familyNo: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  afterDueDate: {
    type: Number,
    positie: true,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  student: {
    type: ObjectId,
    ref: "Student",
    required: true,
  },
  session: {
    type: ObjectId,
    ref: "Session",
    required: true,
  },
  chargedMonth: {
    type: String,
    requried: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  partiallyPaid: {
    type: Boolean,
    default: false,
  },
  paidAmount: {
    type: Number,
  },
  paidDate: {
    type: Date,
  },
  arrears: {
    type: Number,
    default: 0,
  },
  basicFee: {
    type: Number,
    required: true,
  },
  otherCharges: {
    type: [ObjectId],
    ref: "AddCharges",
  },
  discount: {
    type: Number,
  },
  due: {
    type: Number,
  },
  disable: {
    type: Boolean,
    default: false,
  },
});
const StudentsFee = model("StudentsFee", feeSchema);
const guardianFeeSchema = new Schema({
  childs: {
    type: [ObjectId],
    ref: "Student",
  },
  session: {
    type: ObjectId,
    requried: true,
  },
  familyNo: {
    type: String,
    required: true,
  },
  chargedMonth: {
    type: String,
    required: true,
  },
});
const GuardianFee = model("GuardianFee", guardianFeeSchema);

module.exports = { StudentsFee, GuardianFee };
