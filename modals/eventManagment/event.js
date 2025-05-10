const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;
const eventSchema = new Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventDescription: {
    type: String,
    required: true,
  },
  school: {
    type: ObjectId,
    ref: "School",
  },
});
const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
