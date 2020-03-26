import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ConfirmationNumberIcon from "@material-ui/icons/ConfirmationNumber";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import Link from "@material-ui/core/Link";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Cancel from "@material-ui/icons/Cancel";
import DoneAll from "@material-ui/icons/DoneAll";
import Error from "@material-ui/icons/Error";
import More from "@material-ui/icons/More";
import { green } from "@material-ui/core/colors";
import red from "@material-ui/core/colors/red";
import yellow from "@material-ui/core/colors/yellow";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    },
    marginLeft: 50
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch"
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
}));

export default function PrimarySearchAppBar(props) {
  const classes = useStyles();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";

  const mobileMenuId = "primary-search-account-menu-mobile";

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  //Making Notificationss
  function getMenuItems() {
    console.log(props);
    let notifsArray = props.notifs.map(notif => {
      let notification = `Form with Id ${notif.formId.substr(
        0,
        5
      )}.. was rejected by ${notif.assignedToName}`;
      if (notif.type === "PENDING") {
        notification = `A New Form Request for user ${
          notif.assignedToName
        } is sent by ${notif.fromUserUsername}`;
      } else if (notif.type === "APPROVED") {
        notification = `Form with Id ${notif.formId.substr(
          0,
          5
        )}.. was approved by ${notif.assignedToName}`;
      }

      return (
        <StyledMenuItem
          onClick={() =>
            (window.location.href =
              window.location.origin + "/form/" + notif.formId)
          }
        >
          <ListItemIcon>
            {notif.type === "PENDING" ? (
              <Error style={{ color: yellow[900], fontSize: 30 }} />
            ) : notif.type === "APPROVED" ? (
              <DoneAll style={{ color: green[900], fontSize: 30 }} />
            ) : (
              <Cancel style={{ color: red[900], fontSize: 30 }} />
            )}
          </ListItemIcon>
          <ListItemText primary={notification.substr(0, 50)} />
        </StyledMenuItem>
      );
    });

    notifsArray.push(
      <StyledMenuItem>
        <ListItemIcon>
          <More style={{ fontSize: 30 }} />
        </ListItemIcon>
        <ListItemText primary="See More" />
      </StyledMenuItem>
    );

    return notifsArray;
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    window.location.href = window.location.origin;
  };

  const handleClose1 = () => {
    setAnchorEl(null);
  };

  const handleClick1 = event => {
    setAnchorEl(event.currentTarget);
  };

  var pending = props.formRequest;
  var approved = props.approvedForm;
  var rejected = props.rejectedForm;
  var notification = props.notification;

  // Render Mobile Menu
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleClick1} id="customized-menu">
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={notification.toString()} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose1}
      >
        {getMenuItems()}
      </StyledMenu>
      <MenuItem onClick={handleClickOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>{props.name}</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <ConfirmationNumberIcon fontSize="large" />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link href="/home" style={{ color: "white" }}>
              Form
            </Link>
          </Typography>
          {pending !== 0 ? (
            <Badge badgeContent={pending.toString()} color="secondary">
              <Typography className={classes.title} variant="h6" noWrap>
                <Link
                  href="/pending"
                  style={{ color: "white" }}
                  onClick={() => props.deleteNotifs("PENDING", pending)}
                >
                  Pending
                </Link>
              </Typography>
            </Badge>
          ) : (
            <Typography className={classes.title} variant="h6" noWrap>
              <Link
                href="/pending"
                style={{ color: "white" }}
                onClick={() => props.deleteNotifs("PENDING", pending)}
              >
                Pending
              </Link>
            </Typography>
          )}
          {approved !== 0 ? (
            <Badge badgeContent={approved.toString()} color="secondary">
              <Typography className={classes.title} variant="h6" noWrap>
                <Link
                  href="/approved"
                  style={{ color: "white" }}
                  onClick={() => props.deleteNotifs("APPROVED", approved)}
                >
                  Approved
                </Link>
              </Typography>
            </Badge>
          ) : (
            <Typography className={classes.title} variant="h6" noWrap>
              <Link
                href="/approved"
                style={{ color: "white" }}
                onClick={() => props.deleteNotifs("APPROVED", approved)}
              >
                Approved
              </Link>
            </Typography>
          )}
          {rejected !== 0 ? (
            <Badge badgeContent={rejected.toString()} color="secondary">
              <Typography className={classes.title} variant="h6" noWrap>
                <Link
                  href="/rejected"
                  style={{ color: "white" }}
                  onClick={() => props.deleteNotifs("REJECTED", rejected)}
                >
                  Rejected
                </Link>
              </Typography>
            </Badge>
          ) : (
            <Typography className={classes.title} variant="h6" noWrap>
              <Link
                href="/rejected"
                style={{ color: "white" }}
                onClick={() => props.deleteNotifs("REJECTED", rejected)}
              >
                Rejected
              </Link>
            </Typography>
          )}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              style={{ marginRight: 50 }}
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={handleClick1}
            >
              <Badge badgeContent={notification.toString()} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Tooltip title={props.name}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                color="inherit"
                onClick={handleClickOpen}
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Logout of Keep Sharing?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You Would be logged of all the current browsers.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogout} color="secondary">
            Logout
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
