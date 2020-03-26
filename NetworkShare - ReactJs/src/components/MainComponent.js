import React from "react";
import LoadingComponent from "./LoadingComponent";
import ApprovedFormComponent from "./ApprovedFormComponent";
import RejectedFormComponent from "./RejectedFormComponent";
import PendingFormComponent from "./PendingFormComponent";
import FormDetailsComponent from "./FormDetailsComponent";
import NotificationsComponent from "./NotificationsComponent";
import SignInComponent from "./SignInComponent";
import SignUpComponent from "./SignUpComponent";
import HomeComponent from "./HomeComponent";
import HeaderComponent from "./HeaderComponent";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import checkLogin from "./checkLoginStatus";
import socketIOClient from "socket.io-client";
import { SERVER_ENDPOINT } from "./utilPoints";

var socket;

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoggedIn: false,
      access_token: null,
      refresh_token: null,
      formRequest: 0,
      approvedForm: 0,
      rejectedForm: 0,
      notification: 0,
      name: "",
      notifs: []
    };
    socket = socketIOClient(SERVER_ENDPOINT); // Init Socket
  }

  async componentDidMount() {
    console.log("Inside componentDidMount of MainComponent");
    console.log("Origin Url Is:- "+window.location.origin)
    let loginStatus = checkLogin();
    console.log(loginStatus);
    if (loginStatus.status) {
      this.setState({
        name: loginStatus.userDetails.name,
        isLoading: false,
        isLoggedIn: true,
        access_token: loginStatus.access_token
      });

      /*
      -------------------Sockets Actions-------------------------------
      */
      socket.emit("join_department_room", {
        departmentId: sessionStorage.getItem("department"),
        userId: sessionStorage.getItem("user_id")
      });

      socket.on("form_request", data => {
        console.log("got form request");
        console.log(data);
        this.setNotifications(
          this.state.formRequest + 1,
          this.state.notification,
          this.state.approvedForm,
          this.state.rejectedForm
        );
      });

      socket.on("notification", data => {
        console.log("got notification");
        console.log(data);
        let notif = this.state.notifs;
        // if(notif.length === 5){
        //   notif.shift();
        // }
        notif.push(data.details);
        this.setState({ notifs: notif });
        this.setNotifications(
          this.state.formRequest,
          this.state.notification + 1,
          this.state.approvedForm,
          this.state.rejectedForm
        );
      });

      socket.on("approved_request", data => {
        this.setNotifications(
          this.state.formRequest,
          this.state.notification,
          this.state.approvedForm + 1,
          this.state.rejectedForm
        );
      });

      socket.on("rejected_request", data => {
        this.setNotifications(
          this.state.formRequest,
          this.state.notification,
          this.state.approvedForm,
          this.state.rejectedForm + 1
        );
      });

      /*
      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      */
    } else {
      this.setState({ isLoading: false, isLoggedIn: false });
    }
  }

  //Setting Notifications
  setNotifications = (
    formRequest,
    notification,
    approvedForm,
    rejectedForm
  ) => {
    console.log("setting notifications");
    console.log(
      formRequest + " " + notification + " " + approvedForm + " " + rejectedForm
    );
    this.setState({
      formRequest: formRequest,
      notification: notification,
      approvedForm: approvedForm,
      rejectedForm: rejectedForm
    });
  };

  // Deleting NOtifications
  deleteNotifs = (type, number) => {
    console.log("setting notifications");
    //console.log(formRequest+" "+notification+" "+approvedForm+" "+rejectedForm)

    if (type === "PENDING") {
      this.setState({
        formRequest: this.state.formRequest - number,
        notification: this.state.notification - number
      });
    } else if (type === "APPROVED") {
      this.setState({
        approvedForm: this.state.approvedForm - number,
        notification: this.state.notification - number
      });
    } else {
      this.setState({
        rejectedForm: this.state.rejectedForm - number,
        notification: this.state.notification - number
      });
    }
  };

  render() {
    if (this.state.isLoading) {
      return <LoadingComponent />;
    } else {
      if (this.state.isLoggedIn) {
        return (
          <div>
            <HeaderComponent
              setNotifications={this.setNotifications.bind(this)}
              deleteNotifs={this.deleteNotifs.bind(this)}
              name={this.state.name}
              notifs={this.state.notifs}
              notification={this.state.notification}
              formRequest={this.state.formRequest}
              approvedForm={this.state.approvedForm}
              rejectedForm={this.state.rejectedForm}
            />
            <Router>
              {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
              <Switch>
                <Route exact path="/home">
                  <HomeComponent
                    name={this.state.name}
                    notification={this.state.notification}
                    formRequest={this.state.formRequest}
                    approvedForm={this.state.approvedForm}
                    rejectedForm={this.state.rejectedForm}
                  />
                </Route>
                <Route exact path="/approved">
                  <ApprovedFormComponent />
                </Route>
                <Route exact path="/rejected">
                  <RejectedFormComponent />
                </Route>
                <Route exact path="/pending">
                  <PendingFormComponent />
                </Route>
                <Route exact path="/form/:id">
                  <FormDetailsComponent />
                </Route>
                <Route exact path="/notifications">
                  <NotificationsComponent />
                </Route>
              </Switch>
            </Router>
          </div>
        );
      } else {
        return (
          <Router>
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route exact path="/">
                <SignInComponent />
              </Route>
              <Route exact path="/signup">
                <SignUpComponent />
              </Route>
            </Switch>
          </Router>
        );
      }
    }
  }
}

export default MainComponent;
export { socket };
