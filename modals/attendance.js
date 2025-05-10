const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = Schema;
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const attendanceSchema = new Schema({
  machine_id: {
    type: Number,
    required: true,
  },

  school: {
    type: ObjectId,
    ref: "School",
  },
  time_in: {
    type: String,
  },
  time_Out: {
    type: String,
  },
  late_in: {
    type: Boolean,
    default: false,
  },
  earlyLeave: {
    type: Boolean,
    default: false,
  },
  halfLeave: {
    type: Boolean,
    default: false,
  },
  absent: {
    type: Boolean,
    default: true,
  },
  onLeave: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
    default: new Date().toLocaleDateString("en-PK", {
      timeZone: "Asia/Karachi",
    }),
  },
  month: {
    type: String,
    default: monthNames[new Date().getMonth()],
  },

  year: {
    type: String,
    default: new Date().getFullYear(),
  },

  onLeave: {
    type: Boolean,
    default: false,
  },
  modal: {
    type: String,
    enum: ["Student", "Staff"],
  },
  section: {
    type: ObjectId,
    ref: "Section",
  },
  class: {
    type: ObjectId,
    ref: "Class",
  },
  id: {
    type: ObjectId,
    refPath: "modal",
  },

  present: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Attendance", attendanceSchema);
