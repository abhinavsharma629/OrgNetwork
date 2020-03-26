import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneAll from "@material-ui/icons/DoneAll";
import LoadingComponent from "./LoadingComponent";
import checkLogin from "./checkLoginStatus";
import Snackbar from "@material-ui/core/Snackbar";
import Alerts from "./Alerts";
import axios from "axios";
import { socket } from "./MainComponent.js";
import { SERVER_ENDPOINT } from "./utilPoints";

class FormDetailsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReceiver: true,
      isLoading: true,
      userDetails: {},
      flashShow: false,
      flashMessage: "",
      formDetails: {},
      access_token: null
    };
  }

  componentDidMount() {
    console.log("Inside componentDidMount of FormDetailsComponent");
    let loginStatus = checkLogin();
    if (loginStatus.status) {
      console.log(window.location.pathname.split("/")[2]);

      // Getting Form Details
      axios
        .get(
          SERVER_ENDPOINT +
            `api/form/specificForm/${window.location.pathname.split("/")[2]}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${loginStatus.access_token}`
            }
          }
        )
        .then(
          response => {
            console.log(response);
            this.setState({
              isLoading: false,
              userDetails: loginStatus.userDetails,
              access_token: loginStatus.access_token,
              formDetails: response.data.formDetails
            });
          },
          err => {
            this.setState({
              isLoading: false,
              userDetails: loginStatus.userDetails,
              flashShow: true,
              isTryingToRegister: false,
              flashMessage:
                "Sorry we encountered some Error while Fetching Pending List"
            });
          }
        );
    } else {
      window.location.href = window.location.origin;
    }
  }

  // Approving Form
  approvedForm = () => {
    console.log("approvedForm");
    console.log(`Bearer ${this.state.access_token}`);

    socket.emit("approved_request", {
      formId: this.state.formDetails._id,
      userDetails: this.state.userDetails,
      formDetails: this.state.formDetails
    });

    let f = this.state.formDetails;
    f["status"] = "APPROVED";

    this.setState({
      formDetails: f,
      flashShow: true,
      flashMessage: "Successfully Approved Form"
    });

    socket.on("approved_request", data => {
      console.log("approved_request inside form details component");
      console.log(data);
      this.setState({ formDetails: data.formDetails });
    });
  };

  // Rejecting Form
  rejectForm = () => {
    console.log("rejectForm");
    console.log(`Bearer ${this.state.access_token}`);

    socket.emit("rejected_request", {
      formId: this.state.formDetails._id,
      userDetails: this.state.userDetails,
      formDetails: this.state.formDetails
    });

    let f = this.state.formDetails;
    f["status"] = "REJECTED";

    this.setState({
      formDetails: f,
      flashShow: true,
      flashMessage: "Successfully REJECTED Form"
    });

    socket.on("rejected_request", data => {
      console.log("rejected_request inside form details component");
      console.log(data);
      this.setState({ formDetails: data.formDetails });
    });
  };

  render() {
    if (!this.state.isLoading) {
      //console.log(this.state.formDetails);
      let date = new Date(this.state.formDetails.date);
      return (
        <div style={{ marginTop: 50, marginBottom: 50 }}>
          <Snackbar
            open={this.state.flashShow}
            autoHideDuration={5000}
            onClose={this.handleClose}
          >
            <Alerts flashMessage={this.state.flashMessage} />
          </Snackbar>
          <div style={{ marginLeft: 250 }}>
            <TextField
              id="outlined-basic"
              label="Form Name"
              variant="outlined"
              value={this.state.formDetails.form_name}
              disabled={true}
              style={{
                width: 300,
                left: "40%",
                top: "30%",
                transform: "translate(-50%, -50%)"
              }}
            />
            <br />
            <br />
            <TextField
              id="outlined-basic"
              label="Assigned By"
              variant="outlined"
              value={this.state.formDetails.createdByName}
              disabled={true}
              style={{
                width: 300
              }}
            />
            <br />
            <br />
            <br />
            <TextField
              id="outlined-basic"
              label="Date"
              variant="outlined"
              value={date.toLocaleString()}
              disabled={true}
              style={{
                width: 300
              }}
            />
          </div>

          <form style={{ marginTop: 50, marginRight: 150, marginLeft: 250 }}>
            <TextField
              id="outlined-multiline-static"
              label="Message"
              multiline
              rows="20"
              variant="outlined"
              value={this.state.formDetails.message}
              disabled={true}
              fullWidth
              placeholder="Type Your Message Here!!"
            />

            <div>
              <br />

              {this.state.formDetails.status === "PENDING" ? (
                this.state.formDetails.assigned_to ===
                this.state.userDetails.user_id ? (
                  <div
                    style={{
                      position: "absolute",
                      left: "40%",
                      top: "105%"
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      endIcon={<DoneAll />}
                      onClick={() => this.approvedForm()}
                    >
                      Approve
                    </Button>{" "}
                    <Button
                      variant="outlined"
                      color="secondary"
                      endIcon={<DeleteIcon />}
                      style={{ marginLeft: 50 }}
                      onClick={() => this.rejectForm()}
                    >
                      Reject
                    </Button>
                  </div>
                ) : null
              ) : null}
              <br />
              <br />
            </div>
          </form>
        </div>
      );
    } else {
      return <LoadingComponent color="inherit" />;
    }
  }
}

export default FormDetailsComponent;
