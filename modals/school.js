const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { Schema } = mongoose;

const schoolSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    representative: {
      type: String,
      required: true,
    },
    num: {
      type: String,
      required: true,
    },
    num2: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      maxlength: 100,
      trim: true,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      maxlength: 500,
      trim: true,
      required: true,
    },
    schoolCardAddress:{
      type: String,
      trim: true,
      default: "Please Enter School Address",
    },
    remuration: {
      type: Number,
    },
    logo: {
      type: String,
      // required: true,
    },
    currentSession: {
      type: ObjectId,
      ref: "Session",
    },
    sessions: {
      type: [ObjectId],
      ref: "Session",
    },
    staff: {
      type: [ObjectId],
      ref: "Staff",
    },
    students: {
      type: [ObjectId],
      ref: "Student",
    },
    classes: {
      type: [ObjectId],
      ref: "Class",
    },
    courses: {
      type: [ObjectId],
      ref: "Course",
    },
    staf: {
      type: [ObjectId],
      ref: "Staff",
    },
    timeIn: {
      type: String,
      required: true,
    },
    timeOut: {
      type: String,
      required: true,
    },
    midTime: {
      type: String,
      required: true,
    },
    fridayTime: {
      type: String,
      required: true,
    },
    daysOf: {
      sunday: {
        type: Boolean,
        default: false,
      },
      saturday: {
        type: Boolean,
        default: true,
      },
      monday: {
        type: Boolean,
        default: true,
      },
      tuesday: {
        type: Boolean,
        default: true,
      },
      wednesday: {
        type: Boolean,
        default: true,
      },
      thursday: {
        type: Boolean,
        default: true,
      },
      friday: {
        type: Boolean,
        default: true,
      },
    },
    createdBy: {
      type: [ObjectId],
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("School", schoolSchema);
