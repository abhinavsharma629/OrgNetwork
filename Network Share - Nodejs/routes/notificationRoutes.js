var express = require("express");
var router = express.Router();

const checkAuthentication = require("../utils/checkAuthentication");
// Including different models
const Notification = require("../models/Notifications.js");

const accepted_types = ["APPROVED", "REJECTED", "PENDING"];

/*
  Under Construction
*/
// Get All Notifications according to the conditions
router.get("/getAll", checkAuthentication, function(req, res) {
  console.log("getting all notifications depending on the condition");
  if ("type" in req.query && req.query.type in accepted_types) {
    if ("limit" in req.query) {
      Notification.find(
        { type: req.query.type, assigned_to: req.query.department_id },
        {
          $limit: parseInt(req.query.limit),
          from: 1,
          type: 1,
          assigned_to: 1,
          date: 1,
          notification: 1,
          form_id: 1
        }
      ).then(notifications => {
        res.status(200).json(notifications);
      });
    } else {
      Notification.find(
        { type: req.query.type, assigned_to: req.query.department_id },
        {
          from: 1,
          type: 1,
          assigned_to: 1,
          date: 1,
          notification: 1,
          form_id: 1
        }
      ).then(notifications => {
        res.status(200).json(notifications);
      });
    }
  } else {
    Notification.find(
      { assigned_to: req.query.department_id },
      {
        from: 1,
        type: 1,
        assigned_to: 1,
        date: 1,
        notification: 1,
        form_id: 1
      }
    ).then(notifications => {
      res.status(200).json(notifications);
    });
  }
});

module.exports = router;
