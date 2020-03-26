import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import LoadingComponent from "./LoadingComponent";

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  }
}));

export default function MyBackDropComponent() {
  const classes = useStyles();

  return (
    <div>
      <Backdrop className={classes.backdrop} open={true}>
        <LoadingComponent color="inherit" />
      </Backdrop>
    </div>
  );
}
