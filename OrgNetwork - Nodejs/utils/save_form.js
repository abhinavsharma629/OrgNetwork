// Including different models
const Form = require("../models/Forms.js");

const save_notification = require("./save_notifications.js");

// Save Form
const saveForm = async (formDetails, data) => {
  const save_form = new Form({
    form_name: formDetails.formName,
    created_by: formDetails.createdBy,
    createdByName: formDetails.createdByName,
    assigned_to: formDetails.assignedTo.split("-")[0],
    assignee_department: formDetails.assigneeDepartment,
    message: formDetails.message,
    department: formDetails.departmentId
  });

  try {
    await save_form.save();
    //save_notification.send(data, save_form);
    return {
      message: "New Form Saved Successfully",
      status: true,
      formDetails: save_form
    };
  } catch (err) {
    console.log(err);
    return {
      message: "Some Error Occured While Saving Form",
      status: false
    };
  }
};

exports.saveForm = saveForm;
