import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import DraftsIcon from "@material-ui/icons/Drafts";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";

class ListViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentDidMount() {
    console.log("Inside componentDidMount of ListViewComponent");
    this.setState({ list: this.props.pendingList });
  }

  setlist = data => {
    console.log("setting list");
    this.setState({ list: [...this.state.list, data.formDetails] });
  };

  componentWillReceiveProps(props) {
    console.log("Inside componentWillReceiveProps of ListViewComponent");
    this.setState({ list: props.pendingList });
  }

  // Redirection
  handleRedirectionToSpecificForm = formId => {
    console.log("Form Id is " + formId);
    window.location.href = window.location.origin + "/form/" + formId;
  };

  // Preparing List View
  prepareList = () => {
    console.log("preparing List");
    const list = this.state.list.map(item => {
      console.log(item);
      let date = new Date(item.date);
      return (
        <div>
          <ListItem
            button
            onClick={this.handleRedirectionToSpecificForm.bind(this, item._id)}
          >
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText
              primary={item.form_name}
              secondary={item.createdByName + " -  " + date.toLocaleString()}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="view">
                <RemoveRedEyeIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </div>
      );
    });
    return list;
  };

  render() {
    return (
      <div>
        <List component="nav" aria-label="main mailbox folders">
          {this.prepareList()}
        </List>
      </div>
    );
  }
}

export default ListViewComponent;
