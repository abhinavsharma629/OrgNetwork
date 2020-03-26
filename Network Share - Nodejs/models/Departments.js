const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DepartmentSchema = new Schema({
  department_name: {
    type: String,
    required: true
  },
  department_type: {
    type: String,
    required: false
  },
  department_description: {
    type: String,
    required: false
  },
  department_members: [
    { type: Schema.Types.ObjectId, ref: "Users", required: false }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = Department = mongoose.model("Department", DepartmentSchema);
