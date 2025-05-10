const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = Schema;
const studentHistorySchema = new Schema(
  {
    student: {
      type: ObjectId,
      ref: "Student",
      required: true,
    },
    oldSessions: {
      oldSession: {
        type: [ObjectId],
        ref: "Session",
        required: true,
      },
      oldSection: {
        type: [ObjectId],
        ref: "Section",
        required: true,
      },
      oldClasses: {
        type: [ObjectId],
        ref: "Class",
        required: true,
      },
      grade: {
        type: [String],
        required: true,
      },
      percentage: {
        type: [String],
        required: true,
      },
    },
    newSessions: {
      newSession: {
        type: ObjectId,
        ref: "Session",
        required: true,
      },
      newSection: {
        type: ObjectId,
        ref: "Section",
        required: true,
      },
      newClasses: {
        type: ObjectId,
        ref: "Class",
        required: true,
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
module.exports = model("StudentHistory", studentHistorySchema);
