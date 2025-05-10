const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const diarySchema = new Schema(
  {
    pic: {
      type: String,
      required: true,
    },
    section: {
      type: ObjectId,
      ref: "Section",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Diary", diarySchema);
