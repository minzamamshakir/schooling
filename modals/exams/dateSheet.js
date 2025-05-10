const { mongoose, Schema } = require("mongoose");
const { ObjectId } = Schema;
const dateSheet = new mongoose.Schema({
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
  examTerm: {
    type: String,
    requried: true,
  },
  examData: {
    type: Array,
    requried: true,
  },
});
module.exports = mongoose.model("DateSheet", dateSheet);
