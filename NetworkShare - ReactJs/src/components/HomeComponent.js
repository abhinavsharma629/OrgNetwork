import React from "react";
import LoadingComponent from "./LoadingComponent";
import FormComponent from "./FormComponent";

class HomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      access_token: null,
      refresh_token: null
    };
  }

  componentDidMount() {
    console.log("Inside componentDidMount of HomeComponent");
    console.log(this.props.notification);
    this.setState({
      isLoading: false,
      access_token: this.props.access_token,
      refresh_token: this.props.refresh_token
    });
  }

  render() {
    // setNotifications={this.props.setNotifications.bind(this)}
    if (this.state.isLoading) {
      return <LoadingComponent />;
    } else {
      return (
        <FormComponent
          name={this.props.name}
          notification={this.props.notification}
          formRequest={this.props.formRequest}
          approvedForm={this.props.approvedForm}
          rejectedForm={this.props.rejectedForm}
        />
      );
    }
  }
}

export default HomeComponent;
