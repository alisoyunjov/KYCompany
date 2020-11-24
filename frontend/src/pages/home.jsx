import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import "../style/home.css";
import img from "../media/fintrack_gal1.png";
import img2 from "../media/fintrack_gal2.png";
import img3 from "../media/fintrack_gal3.png";

const useStyles = makeStyles(theme => ({
  fill: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  mainFrame: {
    margin: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "80%",
    backgroundColor: "#e4ecf5",
    padding: "50px"
  },
  title: {
    color: "#245f87",
    fontSize: "50px",
    alignSelf: "center",
    fontWeight: "500"
  },
  loading: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  header2: {
    color: "#586069",
    fontWeight: "300",
    fontSize: "30px",
    textAlign: "center"
  },
  header3: {
    color: "#586069",
    fontWeight: "300",
    fontSize: "25px",
    textAlign: "center"
  },
  signUpText: {
    color: "#245f87",
    all: "unset",
    fontWeight: "500",
    cursor: "pointer",
    "&:hover": {
      color: "#8b8e94"
    }
  },
  flexExpenses: {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    marginTop: "20px"
  },
  img: {
    maxWidth: "100%"
  },
  imgSection: {
    width: "60%"
  },
  divider: {
    height: "15px",
    borderBottom: "2px #3f5d8f solid",
    marginBottom: "20px",
    width: "100%"
  },
  features: {
    fontSize: "30px",
    fontWeight: "400",
    color: "#3f5d8f",
    marginTop: "25px",
    borderTop: "1px #3f5d8f solid",
    padding: "10px"
  },
  subHeading: {
    fontSize: "23px",
    fontWeight: "500",
    color: "#3f5d8f"
  }
}));

export default function HomePage(props) {
  const classes = useStyles();
  return (
    <div className={classes.fill}>
      <div className={classes.mainFrame}>
        <div className={classes.title}>Welcome to BioBuy</div>
        <div className={classes.introSection}>
          <div className={classes.header2}>
            BioBuy is your new one stop app for all your Order tracking
            needs.
          </div>
          <div className={classes.header3}>
            {" "}
            <Link to="/signup" className={classes.signUpText}>
              Sign up
            </Link>{" "}
            for an account and get started today
          </div>
        </div>
      </div>
    </div>
  );
}
