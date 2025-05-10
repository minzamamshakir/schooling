const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const guardianSchema = new Schema({
  guardian: {
    name: {
      type: String,
      required: true,
    },
    job: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
    },
  },
  role: {
    type: Number,
    default: 6,
  },
  createdByRole: {
    type: String,
    enum: ["Admin", "Staff"],
  },
  createdBy: {
    type: ObjectId,
    refPath: "createdByRole",
  },
  school: {
    type: ObjectId,
    ref: "School",
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
  regNum: {
    type: String,
    required: true,
    unique: true,
    background: false,
  },
  password: {
    type: String,
    required: true,
  },
  childs: {
    type: [ObjectId],
    ref: "Student",
  },
});

module.exports = mongoose.model("Guardian", guardianSchema);
