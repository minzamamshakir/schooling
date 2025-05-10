const { Schema, model } = require("mongoose");
const { ObjectId } = Schema;

const salarySchema = new Schema({
  regNo: {
    type: String,
    required: true,
  },
  staff: {
    type: ObjectId,
    ref: "Staff",
    required: true,
  },
  session: {
    type: ObjectId,
    ref: "Session",
    required: true,
  },
  salaryMonth: {
    type: String,
    requried: true,
  },
  year: {
    type: Number,
    requried: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  paidAmount: {
    type: Number,
  },
  paidDate: {
    type: Date,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  bonus: {
    type: [ObjectId],
    ref: "AddBonus",
  },
  totalSalary: {
    type: Number,
    required: true,
  },
});
const Salary = model("Salary", salarySchema);

module.exports = { Salary };
