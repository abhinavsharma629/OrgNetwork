const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuthentication = require("../utils/checkAuthentication");
const JWT_KEY = require("../keys").JWT_KEY;
const User = require("../models/Users");
const Department = require("../models/Departments");

// Sign up
router.post("/signup", (req, res, next) => {
  console.log("signing up");
  console.log(req.body);
  User.find({ email: req.body.email }).then(user => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: "Mail exists"
      });
    } else {
      // Hashing password
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          const user = new User({
            email: req.body.email,
            password: hash,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            department: req.body.departmentId
          });
          user
            .save()
            .then(result => {
              console.log(result);
              res.status(201).json({
                message: "Successfully created User"
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });
            });
        }
      });
    }
  });
});

// Login
router.post("/login", (req, res, next) => {
  console.log("inside login");
  console.log(req.body.email);
  console.log(req.body.password);
  User.find({ email: req.body.email })
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }

      // Comparing saved and current password
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          console.log(process.env.JWT_KEY);

          // Jwt Sign in
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            JWT_KEY,
            {
              expiresIn: "365d"
            }
          );

          User.findOneAndUpdate(
            { email: req.body.email },
            { access_token: token }
          ).then(user => {
            return res.status(200).json({
              message: "Authentication successfull",
              access_token: token,
              userDetails: user
            });
          });
        } else {
          res.status(401).json({
            message: "Auth failed"
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Delete user
router.delete("/:userId", checkAuthentication, (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Get departments
router.get("/departments", (req, res, next) => {
  console.log("getting departments list");
  Department.find()
    .then(result => {
      //console.log(result)
      res.status(200).json({
        departments: result,
        total_registered_departments: result.length
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Get department users
router.get("/departmentUsers", (req, res, next) => {
  console.log("getting department users for " + req.query.departmentId);
  User.find({ department: req.query.departmentId })
    .then(result => {
      //console.log(result)
      res.status(200).json({
        departmentUsers: result,
        total_registered_departmentUsers: result.length
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Register departments
router.post("/registerDepartment", (req, res, next) => {
  console.log("creating new department");
  const department = new Department({
    department_name: req.body.departmentName,
    department_type: req.body.departmentType,
    department_description: req.body.departmentDescription
  });
  department
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Successfully created Department"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
