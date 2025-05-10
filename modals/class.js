const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const addChargeSchema = new Schema({
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  charges: {
    type: Array,
    required: true,
  },
});
const AddCharge = mongoose.model("AddCharge", addChargeSchema);
const feeSchema = new Schema({
  fee: {
    type: Number,
    required: true,
  },
  regFee: {
    type: Number,
    required: true,
  },
  additionalCharges: {
    type: [addChargeSchema],
  },
});
const Fee = mongoose.model("Fee", feeSchema);

const classSchema = new Schema(
  {
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
    gender: {
      type: ObjectId,
      ref: "Gender",
      required: true,
    },
    section: {
      type: [ObjectId],
      ref: "Section",
    },
    name: {
      type: String,
      required: true,
      maxlength: 32,
    },
    defaultFee: {
      type: feeSchema,
      required: true,
    },
    courses: {
      type: [ObjectId],
      ref: "Course",
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
const Class = mongoose.model("Class", classSchema);

module.exports = { Class, Fee, AddCharge };
