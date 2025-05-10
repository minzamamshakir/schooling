const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    unique: true,
    maxlength: 32,
    requried: true,
  },
  subjectType: {
    type: String,
    required: true,
  },
  createdBy: {
    type: ObjectId,
    ref: "Admin",
  },
});

module.exports = mongoose.model("Course", courseSchema);
