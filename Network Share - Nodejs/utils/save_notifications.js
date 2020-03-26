// Including different models
const Notification = require("../models/Notifications.js");

// Save Notification
const send = async data => {
  const new_notif = new Notification({
    from: data.fromUser,
    assigned_for: data.forDepartmentId,
    notification: `A New Form Request for user ${
      data.assignedToName
    } is sent by ${data.fromUserUsername}`,
    form_id: data.formId,
    type: data.type
  });

  try {
    await new_notif.save();
    return {
      message: "Successfully Saved Notif",
      status: true
    };
  } catch (err) {
    console.log("Error in saving notification");
    return {
      message: "Error In saving notif",
      status: false
    };
  }
};

exports.send = send;
