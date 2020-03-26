const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var socket = require("socket.io");
var ss = require("socket.io-stream");
const cors = require('cors');

// Including Routes
const formRoutes = require("./routes/formRoutes.js");
const basicUserRoutes = require("./routes/basicUserRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");


/*
  ------------------------------------------Configuring App---------------------------------------------------------------------
*/

const app = express();

app.use(cors());
app.options('*', cors());

//Allow Request Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Using Routes
app.use("/api/form", formRoutes);
app.use("/api/basicUserRoutes", basicUserRoutes);
app.use("/api/notifications", notificationRoutes);

/*
  ---------------------------------------------------------------------------------------------------------------
*/

// Including different models
const User = require("./models/Users.js");
const Department = require("./models/Departments.js");
const Notification = require("./models/Notifications.js");
const Form = require("./models/Forms.js");




//DB Config
const db = require("./keys").mongoURI;
//Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

//Selecting and running app on port
const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there

// Runnig the server on port
const server = app.listen(port, () =>
  console.log(`Server up and running on port ${port} !`)
);

//const server = require('http').createServer(app);

/*
          ------------------------------------SOCKET.IO-------------------------------------------------
*/

// Realtime socket Connections and tasks
var io = socket(server, {
  origins: '*:*'
})

// Util Imports
const save_form = require("./utils/save_form.js");
const update_form = require("./utils/update_form.js");
const save_notifications = require("./utils/save_notifications.js");

function prepareAndSend(notifData, socketId) {
  // Send Notifications Socket
  io.to(socketId).emit("notification", {
    details: notifData
  });

  // Save Notification
  save_notifications.send(notifData).then(response => {
    console.log("after saving notif");
    console.log(response);
  });
}

// On Connection of a new Socket
io.on("connection", socket => {
  console.log("New client connected with id " + socket.id);

  //Join Department's Room and Personal Socket
  socket.on("join_department_room", data => {
    socket.join(data.departmentId);
    socket.join(data.departmentId + "-" + data.userId);
    console.log("Joined Department's Room with id " + data.departmentId);
    console.log(
      "Joined My Own Space with id " + data.departmentId + "-" + data.userId
    );
  });

  //Circulating Form Within The Assigned To Department
  socket.on("circulate_form", data => {
    console.log(
      "Circulating form to department " + data.formDetails.departmentId
    );

    // Save Form
    save_form.saveForm(data.formDetails, data).then(response => {
      console.log("inside socket on getting response after saving form");
      console.log(response);

      let notifData = {
        fromUser: data.formDetails.createdBy,
        forDepartmentId: data.formDetails.departmentId,
        assignedToName: data.formDetails.assignedToName,
        fromUserUsername: data.formDetails.createdByName,
        formId: response.formDetails._id,
        type: "PENDING"
      };

      // Send Notifications
      prepareAndSend(notifData, data.formDetails.departmentId);

      //socket.join(data.formDetails.departmentId);
      io.to(data.formDetails.departmentId).emit("form_request", {
        formDetails: response.formDetails
      });
    });
  });

  //Accept Form and Circulating Accept Form Within The Assigned To Department
  socket.on("approved_request", data => {
    console.log(
      "Accept Form and Circulating notif to department " +
        data.formDetails.department +
        "-" +
        data.userDetails.user_id
    );
    console.log(data);

    // Update form status
    update_form
      .updateForm(data.formDetails, data, "APPROVED")
      .then(response => {
        console.log("inside socket on getting response after updating form");
        console.log(response);
        //socket.join(data.formDetails.departmentId);

        let notifData = {
          fromUser: data.formDetails.created_by,
          forDepartmentId: data.formDetails.department,
          assignedToName: data.userDetails.name,
          fromUserUsername: data.formDetails.createdByName,
          formId: response.formDetails._id,
          type: "APPROVED"
        };

        // Send  Notifications
        prepareAndSend(
          notifData,
          data.formDetails.assignee_department +
            "-" +
            data.formDetails.created_by
        );

        // Send Approved Request Socket

        io
          .to(
            data.formDetails.assignee_department +
              "-" +
              data.formDetails.created_by
          )
          .emit("approved_request", {
            formDetails: response.formDetails
          });
      });
  });

  //Reject Form and Circulating Accept Form Within The Assigned To Department
  socket.on("rejected_request", data => {
    console.log(
      "Reject Form and Circulating notif to department " +
        data.formDetails.department +
        "-" +
        data.userDetails.user_id
    );
    console.log(data);

    // Update form status
    update_form
      .updateForm(data.formDetails, data, "REJECTED")
      .then(response => {
        console.log("inside socket on getting response after updating form");
        console.log(response);
        //socket.join(data.formDetails.departmentId);

        let notifData = {
          fromUser: data.formDetails.created_by,
          forDepartmentId: data.formDetails.department,
          assignedToName: data.userDetails.name,
          fromUserUsername: data.formDetails.createdByName,
          formId: response.formDetails._id,
          type: "REJECTED"
        };

        // Send Notifications
        prepareAndSend(
          notifData,
          data.formDetails.assignee_department +
            "-" +
            data.formDetails.created_by
        );

        // Send Rejection Request Socket
        io
          .to(
            data.formDetails.assignee_department +
              "-" +
              data.formDetails.created_by
          )
          .emit("rejected_request", {
            formDetails: response.formDetails
          });
      });
  });

  //Socket Disconnect
  socket.on("disconnect", () =>
    console.log("Client disconnected having id " + socket.id)
  );
});
