const { mongoose, Schema } = require("mongoose");
const { ObjectId } = Schema;
const exam = new mongoose.Schema({
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
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  termName: {
    type: String,
    required: true,
  },
  termDetail: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Exam", exam);
