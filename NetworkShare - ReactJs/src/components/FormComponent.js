import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import InputLabel from "@material-ui/core/InputLabel";
import { Select } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import LoadingComponent from "./LoadingComponent";
import checkLogin from "./checkLoginStatus";
import Snackbar from "@material-ui/core/Snackbar";
import Alerts from "./Alerts";
import axios from "axios";
import { socket } from "./MainComponent.js";
import { SERVER_ENDPOINT } from "./utilPoints";

class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      department: null,
      assignedTo: null,
      message: null,
      formName: null,
      isLoading: true,
      userDetails: {},
      assignedToName: null,
      socketIODetails: null,
      departmentsList: [],
      departmentUsersList: [],
      formRequest: 0,
      approvedForm: 0,
      rejectedForm: 0,
      notification: 0,
      flashShow: false,
      flashMessage: "",
      severity: "success"
    };
  }

  componentDidMount() {
    console.log("inside componentDidMount of FormComponent");
    console.log(this.props);

    let loginStatus = checkLogin();
    if (loginStatus.status) {
      console.log(loginStatus);

      this.setState({
        isLoading: false,
        userDetails: loginStatus.userDetails,
        approvedForm: this.props.approvedForm,
        rejectedForm: this.props.rejectedForm,
        notification: this.props.notification,
        formRequest: this.props.formRequest
      });

      axios
        .get(SERVER_ENDPOINT + "api/basicUserRoutes/departments", {
          headers: { "Content-Type": "application/json" }
        })
        .then(
          response => {
            console.log(response);
            console.log(typeof response.data.departments);
            this.setState({ departmentsList: [...response.data.departments] });
          },
          err => {
            this.setState({
              flashShow: true,
              isTryingToRegister: false,
              flashMessage:
                "Sorry we encountered some Error while Fetching Departments List"
            });
          }
        );
    } else {
      window.location.href = window.location.origin;
    }
  }

  componentWillReceiveProps(props) {
    console.log("inside componentWillReceiveProps");
    this.setState({
      approvedForm: props.approvedForm,
      rejectedForm: props.rejectedForm,
      notification: props.notification,
      formRequest: props.formRequest
    });
  }

  // Department Dropdown view
  prepareDepartmentView = () => {
    const departments = this.state.departmentsList.map(department => {
      if(department._id !== this.state.userDetails.department){
        return (
          <MenuItem value={department._id} key={department._id}>
            {department.department_name}
          </MenuItem>
        );
      }
    });
    return departments;
  };

  // Users Dropdown VIew
  prepareUsersView = () => {
    const users = this.state.departmentUsersList.map(user => {
      return (
        <MenuItem
          value={user._id + "-" + user.first_name + " " + user.last_name}
          key={user._id}
        >
          {user.first_name} {user.last_name}
        </MenuItem>
      );
    });
    return users;
  };

  // Validate Form
  validateForm = () => {
    console.log(
      this.state.assignedTo +
        " " +
        this.state.department +
        " " +
        this.state.message +
        " " +
        this.state.formName
    );
    if (
      this.state.assignedTo &&
      this.state.department &&
      this.state.message &&
      this.state.formName
    ) {
      return true;
    } else {
      return false;
    }
  };

  // Send Form
  submitForm = () => {
    console.log("submitting form");
    let checkStatus = this.validateForm();
    if (checkStatus) {
      console.log("circulating form");

      socket.emit("circulate_form", {
        formDetails: {
          assignedTo: this.state.assignedTo,
          assignedToName: this.state.assignedToName,
          assigneeDepartment: sessionStorage.getItem("department"),
          departmentId: this.state.department,
          message: this.state.message,
          formName: this.state.formName,
          createdBy: this.state.userDetails.user_id,
          createdByName: this.state.userDetails.name
        },
        userDetails: this.state.userDetails
      });

      this.setState({
        flashShow: true,
        flashMessage: "Successfully Sent Form",
        severity: "success"
      });
    } else {
      this.setState({
        flashShow: true,
        flashMessage: "Fill All The Details Before Submitting",
        severity: "error"
      });
    }
  };

  //Select Department and get users for the particular department
  selectDepartment = event => {
    console.log(
      SERVER_ENDPOINT +
        "api/basicUserRoutes/departmentUsers?departmentId=" +
        event.target.value
    );
    axios
      .get(
        SERVER_ENDPOINT +
          "api/basicUserRoutes/departmentUsers?departmentId=" +
          event.target.value,
        { headers: { "Content-Type": "application/json" } }
      )
      .then(
        response => {
          console.log(response);
          console.log(typeof response.data.departmentUsers);
          this.setState({
            department: event.target.value,
            isDepartmentSelected: true,
            departmentUsersList: [...response.data.departmentUsers]
          });
        },
        err => {
          this.setState({
            flashShow: true,
            flashMessage:
              "Sorry we encountered some Error while Fetching Department Users List",
            severity: "error"
          });
        }
      );
  };

  render() {
    if (this.state.isLoading) {
      return <LoadingComponent color="inherit" />;
    } else {
      console.log(this.state.severity);
      return (
        <div style={{ marginTop: 50, marginBottom: 50 }}>
          <Snackbar
            open={this.state.flashShow}
            autoHideDuration={5000}
            onClose={() => {
              this.setState({ flashShow: false });
            }}
          >
            <Alerts
              flashMessage={this.state.flashMessage}
              severity={this.state.severity}
            />
          </Snackbar>
          <div style={{ marginLeft: 250 }}>
            <TextField
              id="outlined-basic"
              label="Form Name"
              variant="outlined"
              onChange={event =>
                this.setState({ formName: event.target.value })
              }
              style={{
                width: 300,
                left: "40%",
                top: "20%",
                transform: "translate(-50%, -50%)"
              }}
            />
            <br />
            <br />
            <FormControl>
              <InputLabel id="demo-simple-select-label">Department</InputLabel>
              <Select
                style={{ width: 350, marginTop: 10 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.department}
                onChange={event => this.selectDepartment(event)}
              >
                {this.prepareDepartmentView()}
              </Select>
            </FormControl>
            <br />
          </div>
          <div style={{ marginLeft: 250, marginTop: 50 }}>
            <FormControl>
              <InputLabel id="demo-simple-select-label">User</InputLabel>
              <Select
                style={{ width: 350, marginTop: 10 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.assignedTo}
                onChange={event =>
                  //console.log(event.target.value.split('-')[0])
                  this.setState({
                    assignedTo: event.target.value,
                    assignedToName: event.target.value.split("-")[1]
                  })
                }
              >
                {this.prepareUsersView()}
              </Select>
            </FormControl>
            <br />
          </div>
          <form style={{ marginTop: 50, marginRight: 150, marginLeft: 250 }}>
            <TextField
              id="outlined-multiline-static"
              label="Message"
              multiline
              rows="20"
              variant="outlined"
              onChange={event => this.setState({ message: event.target.value })}
              fullWidth
              placeholder="Type Your Message Here!!"
            />

            <div>
              <br />

              <div
                style={{
                  position: "relative",
                  left: "40%",
                  top: "100%"
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  onClick={() => this.submitForm()}
                >
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>
      );
    }
  }
}

export default FormComponent;
