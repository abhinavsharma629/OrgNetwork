import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import { Select } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Link from "@material-ui/core/Link";
import MyBackDropComponent from "./MyBackDropComponent";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Alerts from "./Alerts";
import { SERVER_ENDPOINT } from "./utilPoints";

class SignUpComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      department: "",
      password: "",
      isTryingToRegister: false,
      flashShow: false,
      flashMessage: "",
      departmentsList: [],
      severity: "error"
    };
  }

  componentDidMount = () => {
    // Getting Registered Departments
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
  };

  //Preparing Departments List
  prepareDepartmentView = () => {
    const departments = this.state.departmentsList.map(department => {
      return (
        <MenuItem value={department._id} key={department._id}>
          {department.department_name}
        </MenuItem>
      );
    });
    return departments;
  };

  //Signing Up and Redirecting to Sign In
  signUp = event => {
    console.log("trying to signup");
    this.setState({ isTryingToRegister: true });
    axios
      .post(
        SERVER_ENDPOINT + "api/basicUserRoutes/signup",
        {
          email: this.state.email,
          password: this.state.password,
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          departmentId: this.state.department
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(
        response => {
          let newUrl = window.location.href.replace(
            window.location.pathname,
            "/"
          );
          window.location.href = newUrl;
        },
        err => {
          this.setState({
            flashShow: true,
            isTryingToRegister: false,
            flashMessage: "Sorry we encountered some Error while Logging In"
          });
        }
      );
  };

  handleClose = () => {
    this.setState({ flashShow: false });
  };

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar title="Sign Up" />
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
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)"
              }}
            >
              <TextField
                hintText="Enter your First Name"
                floatingLabelText="First Name"
                onChange={(event, newValue) =>
                  this.setState({ first_name: newValue })
                }
              />
              <br />
              <TextField
                hintText="Enter your Last Name"
                floatingLabelText="Last Name"
                onChange={(event, newValue) =>
                  this.setState({ last_name: newValue })
                }
              />
              <br />
              <TextField
                hintText="Enter your Email"
                type="email"
                floatingLabelText="Email"
                onChange={(event, newValue) =>
                  this.setState({ email: newValue })
                }
              />
              <br />
              <FormControl>
                <InputLabel id="demo-simple-select-label">
                  Department
                </InputLabel>
                <Select
                  style={{ width: 260, marginTop: 20 }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.state.department}
                  onChange={event =>
                    this.setState({ department: event.target.value })
                  }
                >
                  {this.prepareDepartmentView()}
                </Select>
              </FormControl>
              <br />
              <TextField
                type="password"
                hintText="Enter your Password"
                floatingLabelText="Password"
                onChange={(event, newValue) =>
                  this.setState({ password: newValue })
                }
              />
              <br />
              <RaisedButton
                label="Register"
                primary={true}
                style={style}
                onClick={event => this.signUp(event)}
              />
              <div style={{ marginTop: 20, marginLeft: 30 }}>
                <text style={{ fontWeight: "bold", fontSize: 12 }}>
                  Already Have An Account ? <Link href="/">Login</Link>
                </text>
              </div>
            </div>
          </div>
        </MuiThemeProvider>
        {this.state.isTryingToRegister ? <MyBackDropComponent /> : null}
      </div>
    );
  }
}
const style = {
  margin: 15,
  marginLeft: 80
};
export default SignUpComponent;
