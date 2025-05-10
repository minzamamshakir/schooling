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
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    maxlength: 500,
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
  education: {
    type: Array,
  },
  schools: {
    type: [ObjectId],
    ref: "School",
  },
  createdBy: {
    type: ObjectId,
    ref: "Admin",
  },
});

module.exports = mongoose.model("Admin", adminSchema);
