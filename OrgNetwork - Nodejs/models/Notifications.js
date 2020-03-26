const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const NotificationSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: "User" },
  assigned_to: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  notification: {
    type: String,
    required: true
  },
  form_id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    default: "PENDING"
  }
  //Future Implementation of mark as read
  //readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});
module.exports = Notification = mongoose.model(
  "Notification",
  NotificationSchema
);
