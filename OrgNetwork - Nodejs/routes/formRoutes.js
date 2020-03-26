var express = require("express");

// Including different models
const User = require("../models/Users.js");
const Department = require("../models/Departments.js");
const Notification = require("../models/Notifications.js");
const Form = require("../models/Forms.js");
const checkAuthentication = require("../utils/checkAuthentication");
const getLoggedUser = require("../utils/getLoggedUser");
const update_form = require("../utils/update_form.js");

var router = express.Router();
var mongoose = require("mongoose");

const accepted_types = {
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PENDING: "PENDING"
};

// Saving Form route.
router.post("/saveForm", checkAuthentication, async function(req, res) {
  console.log("saving form");
  const params = req.body;
  const new_form = new Form({
    form_name: params.form_name,
    created_by: req.user,
    assigned_to: User.collection.findOne({ _id: params.assigned_to }),
    message: params.message,
    status: "PENDING"
  });
  try {
    await new_form.save();
    res.status(201).json({
      message: "Form Saved and Sent Successfully"
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Accept Form route.
router.put("/formAccept/:id", checkAuthentication, async function(req, res) {
  console.log("accepting form");
  update_form
    .updateForm(req.data.formDetails, req.data, "APPROVED")
    .then(response => {
      console.log(response);
      res.status(200).json(response);
    });
});

// Reject Form route.
router.put("/formReject/:id", checkAuthentication, async function(req, res) {
  console.log("rejecting form");

  update_form
    .updateForm(req.data.formDetails, req.data, "REJECTED")
    .then(response => {
      console.log(response);
      res.status(200).json(response);
    });
});

// Get Form route.
router.get("/specificForm/:id", checkAuthentication, function(req, res) {
  console.log("getting form with id " + req.params.id);
  const form_id = req.params.id;
  Form.collection
    .findOne({ _id: mongoose.Types.ObjectId(form_id) })
    .then(form => {
      console.log(form);
      if (form) {
        res.status(200).json({
          message: "Form found!!",
          formDetails: form
        });
      } else {
        res.status(404).json({
          message: "Form with specific id not found!!"
        });
      }
    });
});

// Get Form route depending on the codition.
router.get("/all", checkAuthentication, async function(req, res, next) {
  console.log("getting all form depending on the condition");
  const user = await getLoggedUser(req);
  console.log(user);
  console.log(req.query);
  let query = {};

  // According to the conditions
  if ("status" in req.query && req.query.status in accepted_types) {
    if ("limit" in req.query) {
      if ("type" in req.query && req.query.type === "0") {
        console.log("fetching assigned_to me");
        if (req.query.status !== "PENDING") {
          query = { status: req.query.status, assigned_to: user.userId };
        } else {
          query = {
            status: req.query.status,
            department: req.query.departmentId
          };
        }
      } else {
        console.log("fetching assigned_by me");
        query = { status: req.query.status, created_by: user.userId };
      }

      Form.find(query, {
        $limit: parseInt(req.query.limit),
        form_name: 1,
        date: 1,
        _id: 1,
        assignee_department: 1,
        form_message: 1,
        created_by: 1,
        assigned_to: 1,
        department: 1,
        status: 1,
        createdByName: 1
      }).then(forms => {
        res.status(200).json(forms);
      });
    } else {
      Form.find({
        status: req.query.status,
        department: req.query.departmentId
      }).then(forms => {
        res.status(200).json(JSON.stringify(forms));
      });
    }
  } else {
    res.status(404).json({
      message: "Forms with specific tpye not found!!"
    });
  }
});

module.exports = router;
