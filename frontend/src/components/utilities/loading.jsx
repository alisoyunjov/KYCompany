import React from "react";
import Dialog from "@material-ui/core/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const NewDialog = withStyles({
  paper: {
    height: "70px",
    width: "70px"
  }
})(Dialog);

const useStyles = makeStyles(() => ({
  loading: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

export default function Loading(props) {
  const { loading } = props;
  const classes = useStyles();

  return (
    <NewDialog disableBackdropClick open={loading}>
    <div className={classes.loading}>
        <CircularProgress />
    </div>
    </NewDialog>
  );
}
