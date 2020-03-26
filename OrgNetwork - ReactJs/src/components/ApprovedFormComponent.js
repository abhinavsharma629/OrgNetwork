import React from "react";
import ListViewComponent from "./ListViewComponent";
import LoadingComponent from "./LoadingComponent";
import checkLogin from "./checkLoginStatus";
import axios from "axios";
import { socket } from "./MainComponent.js";
import Snackbar from "@material-ui/core/Snackbar";
import Alerts from "./Alerts";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { SERVER_ENDPOINT } from "./utilPoints";

class ApprovedFormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isnewApprovedForm: false,
      isReceiver: true,
      department: "",
      assignedTo: "",
      isLoading: true,
      userDetails: {},
      flashShow: false,
      flashMessage: "",
      pendingList: [],
      severity: "error",
      value: 0,
      access_token: null
    };
  }

  componentDidMount() {
    console.log("Inside componentDidMount of ApprovedFormComponent");
    let loginStatus = checkLogin();
    if (loginStatus.status) {
      // Approved Form Socket
      socket.on("approved_request", data => {
        console.log("approved_request inside approved forms component");
        console.log(data);
        this.setState({
          pendingList: [...this.state.pendingList, data.formDetails],
          flashShow: true,
          value: 1,
          flashMessage: `${data.formDetails.form_name} got APPROVED`,
          severity: "success"
        });
      });

      // Get Data
      axios
        .get(
          SERVER_ENDPOINT +
            `api/form/all?status=APPROVED&type=0&userId=${
              loginStatus.userDetails.user_id
            }&departmentId=${loginStatus.userDetails.department}&limit=5`,
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
              pendingList: response.data
            });
          },
          err => {
            this.setState({
              isLoading: false,
              userDetails: loginStatus.userDetails,
              flashShow: true,
              isTryingToRegister: false,
              flashMessage:
                "Sorry we encountered some Error while Fetching Approved List",
              severity: "error"
            });
          }
        );
    } else {
      window.location.href = window.location.origin;
    }
  }

  // Get data according to the switch change
  switchDetails = value => {
    console.log("setting");
    this.setState({ value: value, isLoading: true });
    axios
      .get(
        SERVER_ENDPOINT +
          `api/form/all?status=APPROVED&type=${value.toString()}&departmentId=${
            this.state.userDetails.department
          }&limit=5`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.state.access_token}`
          }
        }
      )
      .then(
        response => {
          console.log(response);
          this.setState({
            isLoading: false,
            userDetails: this.state.userDetails,
            pendingList: response.data
          });
        },
        err => {
          this.setState({
            isLoading: false,
            userDetails: this.state.userDetails,
            flashShow: true,
            isTryingToRegister: false,
            flashMessage:
              "Sorry we encountered some Error while Fetching Pending List",
            severity: "error"
          });
        }
      );
  };

  render() {
    if (!this.state.isLoading) {
      return (
        <div>
          <Snackbar
            open={this.state.flashShow}
            autoHideDuration={5000}
            onClose={this.handleClose}
          >
            <Alerts
              flashMessage={this.state.flashMessage}
              severity={this.state.severity}
            />
          </Snackbar>
          <div
            style={{
              position: "absolute",
              left: "45%",
              top: "20%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <Paper square>
              <Tabs
                value={this.state.value}
                indicatorColor="secondary"
                textColor="primary"
                onChange={(event, newValue) => this.switchDetails(newValue)}
                aria-label="disabled tabs example"
              >
                <Tab label="APPROVED BY ME" />
                <Tab label="APPROVED BY OTHERS" />
              </Tabs>
            </Paper>
          </div>
          <br />
          <br />
          <div style={{ margin: 100, color: "blue" }}>
            <ListViewComponent pendingList={this.state.pendingList} />
          </div>
        </div>
      );
    } else {
      return <LoadingComponent color="inherit" />;
    }
  }
}

export default ApprovedFormComponent;
