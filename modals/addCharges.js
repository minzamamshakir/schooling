const { Schema, model } = require("mongoose");
const { ObjectId } = Schema;

const addChargesSchema = new Schema({
  month: {
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
  school: {
    type: ObjectId,
    ref: "School",
  },
  student: {
    type: String,
  },
  studentDetail: {
    type: ObjectId,
    ref: "Student",
  },
  class: {
    type: ObjectId,
    ref: "Class",
  },
  section: {
    type: ObjectId,
    ref: "Section",
  },
  charges: {
    type: Array,
    required: true,
  },
});

module.exports = model("AddCharges", addChargesSchema);
