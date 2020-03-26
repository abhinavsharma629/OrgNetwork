const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const FormSchema = new Schema({
  form_name: {
    type: String,
    required: true
  },
  created_by: { type: Schema.Types.ObjectId, ref: "Users" },
  createdByName: {
    type: String,
    required: true
  },
  assigned_to: { type: Schema.Types.ObjectId, ref: "Users" },
  department: { type: Schema.Types.ObjectId, ref: "Department" },
  assignee_department: { type: Schema.Types.ObjectId, ref: "Department" },
  date: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "PENDING"
  }
});
module.exports = Form = mongoose.model("Form", FormSchema);
