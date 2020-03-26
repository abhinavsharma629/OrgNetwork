// Including different models
const Form = require("../models/Forms.js");

const save_notification = require("./save_notifications.js");

// Update Form Status
const updateForm = async (formDetails, data, status) => {
  console.log("trying to update form");
  console.log(formDetails);
  let form = await Form.findOneAndUpdate(
    { _id: formDetails._id, assigned_to: formDetails.assigned_to },
    { $set: { status: status } }
  );
  console.log(form);
  if (form) {
    return {
      message: "Form Updated Successfully",
      status: true,
      formDetails: form
    };
  } else {
    console.log(err);
    return {
      message: "Some Error Occured While Saving Form",
      status: false
    };
  }
};

exports.updateForm = updateForm;
