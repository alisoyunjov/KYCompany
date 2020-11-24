import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
import Box from "@material-ui/core/Box";
import { Link } from "react-router-dom";
import Loading from "../components/utilities/loading";

// TEMPLATE FOR THIS COMPONENT FROM:
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-up/SignUp.js

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

class LoginPage extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      error: "",
      loading: false
    };
    this.signup = this.signup.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  signup(event) {
    this.setState({ loading: true });
    axios
      .post("/api/user/signin", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        if (response.status === 200) {
          this.setState({ loading: false });
          document.location.href = "/";
        }
      })
      .catch(error => {
        console.log(error.response);
        this.setState({
          error: error.response.data.error,
          loading: false
        });
      });
    event.preventDefault();
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <form className={classes.form} onSubmit={this.signup}>
              <Grid container spacing={2}>
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
                Login
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link to="/signup">Don't have an account? Sign up</Link>
                </Grid>
              </Grid>
            </form>
            <Box mt={1}>{this.state.error}</Box>
          </div>
        </Container>
        <Loading loading={this.state.loading} />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(LoginPage);
