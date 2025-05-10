const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { Schema } = mongoose;
const crypto = require("crypto");
const uuidv1 = require("uuid");

// testiong models for error

const adminSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  firstName: {
    type: String,
    maxlength: 32,
    trim: true,
  },
  lastName: {
    type: String,
    maxlength: 32,
    trim: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  pic: {
    type: String,
  },
  role: {
    type: Number,
    default: 1,
  },
  password: {
    type: String,
  },
  userFor: {
    type: String,
    enum: ["Admin", "Staff", "Student", "Guardian", "SuperAdmin"],
  },
  informativeModel: {
    type: ObjectId,
    refPath: "userFor",
  },
  permissions: {
    type: ObjectId,
    ref: "Permissions",
  },
});

module.exports = mongoose.model("User", adminSchema);
