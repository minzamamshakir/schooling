const { mongoose, Schema } = require("mongoose");
const { ObjectId } = Schema;
const result = new mongoose.Schema({
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
  section: {
    type: ObjectId,
    ref: "Section",
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  admissionNo: {
    type: String,
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  subjects: {
    type: Array,
    required: true,
  },
  grade: {
    type: String,
  },
  percentage: {
    type: Number,
  },
  totalObtainmarks: {
    type: Number,
  },
  grandTotal: {
    type: Number,
  },
  position: {
    type: Number,
  },
});
module.exports = mongoose.model("Result", result);
