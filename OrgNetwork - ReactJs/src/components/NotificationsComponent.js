import React from "react";
import ListViewComponent from "./ListViewComponent";
import LoadingComponent from "./LoadingComponent";
import checkLogin from "./checkLoginStatus";
//import { SERVER_ENDPOINT } from "./utilPoints";
//import axios from "axios";

class NotificationsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isnewNotifications: false,
      isReceiver: true,
      department: "",
      assignedTo: "",
      isLoading: true,
      userDetails: {},
      pendingList: []
    };
  }

  componentDidMount() {
    let loginStatus = checkLogin();
    if (loginStatus.status) {
      console.log("UNDER CONSTRUCTION");
      // axios
      //   .get(
      //     `http://localhost:5000/api/notifications/all`,
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${loginStatus.access_token}`
      //       }
      //     }
      //   )
      //   .then(
      //     response => {
      //       console.log(response);
      //       this.setState({
      //         isLoading: false,
      //         userDetails: loginStatus.userDetails,
      //         access_token: loginStatus.access_token,
      //         pendingList: response.data.notifications
      //       });
      //     },
      //     err => {
      //       this.setState({
      //         isLoading: false,
      //         userDetails: loginStatus.userDetails,
      //         flashShow: true,
      //         isTryingToRegister: false,
      //         flashMessage:
      //           "Sorry we encountered some Error while Fetching Notifications List"
      //       });
      //     }
      //   );
    } else {
      window.location.href = window.location.origin;
    }
  }

  render() {
    if (!this.state.isLoading) {
      return (
        <div style={{ margin: 100, color: "blue" }}>
          <ListViewComponent pendingList={this.state.pendingList} />
        </div>
      );
    } else {
      return <LoadingComponent color="inherit" />;
    }
  }
}

export default NotificationsComponent;
