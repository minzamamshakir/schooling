const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;
const dateSchema = new Schema({
  startDate: {
    type: Date,
    required: true,
  },
  school: {
    type: ObjectId,
    ref: "School",
    required: true,
  },
  tillDate: {
    type: Date,
    required: true,
  },
  key: {
    type: ObjectId,
    ref: "Event",
    required: true,
  },
});
const DateOfEvent = mongoose.model("DateOfEvent", dateSchema);
module.exports = DateOfEvent;
