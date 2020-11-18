import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
import Box from "@material-ui/core/Box";
import Loading from "../components/utilities/loading";
import CheckIcon from "@material-ui/icons/Check";

// TEMPLATE FOR THIS COMPONENT FROM:
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-up/SignUp.js

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

const useStyles = makeStyles(() => ({
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  top: {
    marginTop: "20px",
  },
  info: {
    fontSize: "20px",
  },
}));

function VerificationCodeModal(props) {
  const { email, username, password } = props;
  const [token, setToken] = React.useState("");
  const [errToken, setErrToken] = React.useState(false);
  const [error, setError] = React.useState("");
  const classes = useStyles();
  const handleChangeToken = (event) => {
    setErrToken(false);
    setToken(event.target.value);
  };

  const handleSubmit = () => {
    document.location.href = "/";
  };

  return (
    <div>
      <div className={classes.main}>

        <div className={classes.info}>
          Token was sent to <b>{email}</b>
        </div>
        <form className={classes.top}>
          <TextField
            error={errToken}
            id="token"
            label="Token"
            variant="outlined"
            value={token}
            type="text"
            onChange={handleChangeToken}
          />
          {errToken ? <FormHelperText>Field is Required</FormHelperText> : ""}
          <div>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              className={classes.top}
              onClick={handleSubmit}
            >
              Confirm
            </Button>
          </div>
        </form>
        <div>{error}</div>
      </div>
    </div>
  );
}

class SignupPage extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      error: "",
      loading: false,
      openvalidator: false,
    };
    this.signup = this.signup.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  signup(event) {
    this.setState({ loading: true });
    axios
      .post("/api/user/signup", {
        email: this.state.email,
        username: this.state.username,
        password: this.state.password,
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ loading: false, openvalidator: true });
          document.location.href = "/";
        }
      })
      .catch((error) => {
        console.log(error.response);
        this.setState({
          error: error.response.data.error,
          loading: false,
        });
      });
    event.preventDefault();
  }
  render() {
    const { classes } = this.props;
    let page = (
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className={classes.form} onSubmit={this.signup}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={this.handleChange}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="fname"
                    name="username"
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    onChange={this.handleChange}
                    label="Username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={this.handleChange}
                    autoComplete="current-password"
                  />
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                type="submit"
              >
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link to="/login">Already have an account? Sign in</Link>
                </Grid>
              </Grid>
            </form>
            <Box mt={1} style={{ color: "red" }}>
              {this.state.error}
            </Box>
          </div>
        </Container>
        <Loading loading={this.state.loading} />
      </div>
    );
    return <div>{page}</div>;
  }
}

export default withStyles(styles, { withTheme: true })(SignupPage);
