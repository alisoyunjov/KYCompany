import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import ClearIcon from "@material-ui/icons/Clear";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

const NewDialog = withStyles({
  paper: {
    margin: "20px",
    padding: "10px"
  }
})(Dialog);

const styles = makeStyles(() => ({
  prev: {
    fontSize: "22px",
    padding: "3px",
    display: "flex"
  },
  prev_val: {
    fontWeight: "600",
    marginLeft: "10px"
  },
  prev_non: {
    color: "red",
    marginLeft: "10px"
  },
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  rootItem: {
    padding: "5px",
    margin: "5px"
  }
}));

export default function UpdatePasswordForm(props) {
  /**
   * Requires:
   * props.user: current user
   * props.field: field to update
   */
  const { onClose, open, user } = props;
  const [curPass, setcurPass] = React.useState("");
  const [newPass, setnewPass] = React.useState("");
  const [matchPass, setmatchPass] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorCurPass, seterrorCurPass] = React.useState(false);
  const [errorNewPass, seterrorNewPass] = React.useState(false);
  const [errorMatchPass, seterrorMatchPass] = React.useState(false);
  const [error, setError] = React.useState("");

  const classes = styles();

  const handleChangeCurPass = event => {
    seterrorCurPass(false);
    setcurPass(event.target.value);
  };

  const handleChangeNewPass = event => {
    seterrorNewPass(false);
    setnewPass(event.target.value);
  };

  const handleChangeMatchPass = event => {
    seterrorMatchPass(false);
    setmatchPass(event.target.value);
  };

  const close = () => {
    setcurPass("");
    setError("");
    seterrorCurPass(false);
    seterrorMatchPass(false);
    seterrorNewPass(false);
    setmatchPass("");
    setnewPass("");
    onClose();
  };

  const handleSubmit = () => {
    // Make either an axios update email or salary call
    let e = false;
    if (curPass === "") {
      seterrorCurPass(true);
      e = true;
    }
    if (newPass === "") {
      seterrorNewPass(true);
      e = true;
    }
    if (newPass !== matchPass) {
      seterrorMatchPass(true);
      e = true;
    }
    if (e) {
      return null;
    }
    setLoading(true);
    axios
      .patch("/api/user/profile/password", {
        username: user,
        old_password: curPass,
        new_password: newPass
      })
      .then(res => {
        if (res.status === 200) {
          setLoading(false);
          close();
        }
      })
      .catch(err => {
        console.log(err.response);
        setLoading(false);
        setError(err.response.data.error);
      });
  };

  const form = loading ? (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  ) : (
    <form className={classes.root}>
      <TextField
        error={errorCurPass}
        id="oldPass"
        label="Old Password"
        variant="outlined"
        value={curPass}
        type="password"
        onChange={handleChangeCurPass}
        className={classes.rootItem}
      />
      {errorCurPass ? <FormHelperText>Field is Required</FormHelperText> : ""}
      <TextField
        error={errorNewPass}
        id="newPass"
        label="New Password"
        variant="outlined"
        value={newPass}
        type="password"
        onChange={handleChangeNewPass}
        className={classes.rootItem}
      />
      {errorNewPass ? <FormHelperText>Field is Required</FormHelperText> : ""}
      <TextField
        error={errorMatchPass}
        id="confirmPass"
        label="Confirm Password"
        variant="outlined"
        value={matchPass}
        type="password"
        onChange={handleChangeMatchPass}
        className={classes.rootItem}
      />
      {errorMatchPass ? (
        <FormHelperText>Does not match new password</FormHelperText>
      ) : (
        ""
      )}
      <Grid
        container
        className={classes.rootItem}
        direction="row"
        justify="center"
        alignContent="center"
        spacing={2}
        style={{ width: "99%" }}
      >
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveAltIcon />}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ClearIcon />}
            onClick={close}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );

  return (
    <NewDialog
      disableBackdropClick
      onClose={onClose}
      maxWidth="sm"
      aria-labelledby="simple-dialog-title"
      fullWidth={true}
      open={open}
    >
      <Typography component="h1" variant="h4" color="primary" gutterBottom>
        Update {props.field}
      </Typography>
      {form}

      <Box mt={1}>{error}</Box>
    </NewDialog>
  );
}
