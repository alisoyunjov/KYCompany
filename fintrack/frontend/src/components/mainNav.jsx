import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import { blue } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import "../style/mainNav.css";
import "../style/main.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Avatar } from "@material-ui/core";

const drawerWidth = 240;

// Style from https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard/Dashboard.js
const styles = theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  fixedHeight: {
    height: 240
  },
  profileIcon: {
    color: theme.palette.getContrastText(blue[700]),
    backgroundColor: blue[700],
    cursor: "pointer"
  }
});

class NavigationBar extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };

    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    axios
      .post("/api/user/signout")
      .then(response => {
        if (response.status === 200) {
          document.location.href = "/";
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  }
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  handleProfile() {
    window.location.href = "/profile";
  }

  render() {
    //let logo = <div className="signin_button"></div>;
    //let status = this.props.isauth ? "Logged in" : "Not logged in";
    let login_el = "";
    let signup_el = "";
    let signout_el = "";
    const ITEM_HEIGHT = 48;
    const { classes } = this.props;

    const SignUpButton = withStyles({
      root: {
        fontSize: 16,
        padding: "6px 12px",
        lineHeight: 1.5,
        backgroundColor: "#007bff",
        borderColor: "#007bff",
        marginLeft: "5px",
        "&:hover": {
          backgroundColor: "#0069d9",
          borderColor: "#0062cc",
          boxShadow: "none"
        },
        "&:active": {
          boxShadow: "none",
          backgroundColor: "#0062cc",
          borderColor: "#005cbf"
        },
        "&:focus": {
          boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)"
        }
      }
    })(Button);

    const profile = (
      <div>
        <Avatar className={classes.profileIcon} onClick={this.handleClick}>
          <AccountCircleIcon />
        </Avatar>
        <Menu
          id="long-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200
            }
          }}
        >
          <Link to="/profile" className="no_text_decor link">
            <MenuItem key="profile">
              <ListItemIcon>
                <PersonOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
          </Link>

          <MenuItem key="signout" onClick={this.signOut}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </MenuItem>
        </Menu>
      </div>
    );

    if (!this.props.isauth) {
      login_el = (
        <Link className="no_text_decor" to="/login">
          <Button color="inherit">Login</Button>
        </Link>
      );
      signup_el = (
        <Link to="/signup" className="no_text_decor">
          <SignUpButton variant="contained" color="primary">
            Sign up
          </SignUpButton>
        </Link>
      );
    } else {
      signout_el = profile;
    }

    return (
      <AppBar position="fixed" className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            <Link to="/" className="no_text_decor link">
              BioBuy
            </Link>
          </Typography>
          {login_el}
          {signup_el}
          {signout_el}
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NavigationBar);
