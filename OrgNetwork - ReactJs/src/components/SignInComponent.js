import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import Link from "@material-ui/core/Link";
import MyBackDropComponent from "./MyBackDropComponent";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Alerts from "./Alerts";
import { SERVER_ENDPOINT } from "./utilPoints";

class SignInComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isTryingToLogin: false,
      flashShow: false,
      flashMessage: "",
      severity: "error"
    };
  }

  signIn = event => {
    console.log("trying to login");

    this.setState({ isTryingToLogin: true });

    axios
      .post(
        SERVER_ENDPOINT + "api/basicUserRoutes/login",
        {
          email: this.state.email,
          password: this.state.password
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(
        response => {
          console.log(response.data);

          // Storing Session Details
          sessionStorage.setItem("access_token", response.data.access_token);
          sessionStorage.setItem("email", response.data.userDetails.email);
          sessionStorage.setItem(
            "name",
            response.data.userDetails.first_name +
              " " +
              response.data.userDetails.last_name
          );
          sessionStorage.setItem("user_id", response.data.userDetails._id);
          sessionStorage.setItem(
            "department",
            response.data.userDetails.department
          );
          window.location.href = window.location.href + "home";
        },
        err => {
          console.log(err)
          if('response' in err && 'status' in err['reponse']){
            if (err["response"]["status"] === 401) {
              this.setState({
                flashShow: true,
                isTryingToLogin: false,
                flashMessage: "You are Not Registered"
              });
          }
          else{
            this.setState({
              flashShow: true,
              isTryingToLogin: false,
              flashMessage: "Sorry we encountered some Error while Logging In"
            });
          }
          } else {
            this.setState({
              flashShow: true,
              isTryingToLogin: false,
              flashMessage: "Sorry we encountered some Error while Logging In"
            });
          }
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
            <AppBar title="Sign In" />
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
                hintText="Enter your Email Address"
                floatingLabelText="Email"
                onChange={(event, newValue) =>
                  this.setState({ email: newValue })
                }
              />
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
                label="Login"
                primary={true}
                style={style.basic}
                onClick={event => this.signIn(event)}
              />
              <div style={{ marginTop: 20, marginLeft: 50 }}>
                <text style={{ fontWeight: "bold", fontSize: 12 }}>
                  Not registered Yet ? - <Link href="/signup">Register</Link>
                </text>
              </div>
            </div>
          </div>
        </MuiThemeProvider>
        {this.state.isTryingToLogin ? <MyBackDropComponent /> : null}
      </div>
    );
  }
}
const style = {
  basic: {
    margin: 15,
    marginLeft: 80
  }
};

export default SignInComponent;
