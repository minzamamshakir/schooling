const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = Schema;
const finalCriteriaSchema = new Schema({
  studentName: {
    type: String,
    required: true,
  },
  admissionNo: {
    type: String,
    required: true,
  },
  section: {
    type: ObjectId,
    ref: "Section",
    required: true,
  },
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
  grade: {
    type: String,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
});
module.exports = model("FinalCriteria", finalCriteriaSchema);
