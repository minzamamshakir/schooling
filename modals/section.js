const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const sectionSchema = new Schema(
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
    class: {
      type: ObjectId,
      ref: "Class",
      required: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 32,
    },
    color: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
    },
    courses: {
      type: [ObjectId],
      ref: "Course",
    },
    createdBy: {
      type: ObjectId,
      ref: "Admin",
    },
    students: {
      type: [ObjectId],
      ref: "Student",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Section", sectionSchema);
