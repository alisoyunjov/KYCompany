import React, { Component } from "react";
import "./App.css";
import { Route, Switch, Redirect } from "react-router-dom";

import HomePage from "./pages/home";
import ExpensesPage from "./pages/expenses";
import InvestmentsPage from "./pages/investments";
import AboutPage from "./pages/about";
import ErrorPage from "./pages/error";
import ProfilePage from "./pages/profile";

import NavigationBar from "./components/mainNav";
import SideNavigation from "./components/sideNav";
//import DashBoard from "./pages/dashboard2";

import axios from "axios";
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import DashBoard from "./pages/dashboard";

class App extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = { isauth: false, user: null };
  }

  checkAuth() {
    axios
      .get("/api/user/isauthenticated")
      .then(response => {
        //console.log(response);
        if (
          this.state.isauth !== response.data.isauth ||
          this.state.user !== response.data.username
        ) {
          this.setState({
            isauth: response.data.isauth,
            user: response.data.username
          });
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  }

  componentDidMount() {
    this.checkAuth();
  }
  /**
   * <div class='flex'>
   *  <div>chart</div>
   * <div></div>
   * </div>
   */
  render() {
    //if (!this.state.isauth) return <h1>ERROR</h1>;

    let sideNav = this.state.isauth ? <SideNavigation /> : "";
    let just_left = this.state.isauth
      ? "App_top_just App_left_just"
      : "App_top_just";
    // Determine swtich rules if authenticated or not
    let switchRule = (
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/signup">
          <SignupPage />
        </Route>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/error">
          <ErrorPage />
        </Route>
      </Switch>
    );
    if (this.state.isauth) {
      switchRule = (
        <Switch>
          <Route path="/dashboard">
            <DashBoard isauth={this.state.isauth} user={this.state.user} />
          </Route>
          <Route path="/profile">
            <ProfilePage isauth={this.state.isauth} user={this.state.user} />
          </Route>
          <Route path="/expenses">
            <ExpensesPage isauth={this.state.isauth} user={this.state.user} />
          </Route>
          <Route path="/investments">
            <InvestmentsPage
              isauth={this.state.isauth}
              user={this.state.user}
            />
          </Route>
          <Route path="/about">
            <AboutPage isauth={this.state.isauth} user={this.state.user} />
          </Route>
          <Route path="/error">
            <ErrorPage />
          </Route>
          <Redirect from="/" to="/dashboard" />
        </Switch>
      );
    }
    return (
      <div>
        <NavigationBar isauth={this.state.isauth} user={this.state.user} />
        {sideNav}
        <div className={just_left}>{switchRule}</div>
      </div>
    );
  }
}

export default App;
