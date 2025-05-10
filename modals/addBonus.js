const { Schema, model } = require("mongoose");
const { ObjectId } = Schema;

const addBonusSchema = new Schema({
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
  staff: {
    type: String,
  },
  staffDetail: {
    type: ObjectId,
    ref: "Staff",
  },
  bonus: {
    type: Array,
    required: true,
  },
});

module.exports = model("AddBonus", addBonusSchema);
