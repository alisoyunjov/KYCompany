import React, { Component } from "react";
import "../style/mainNav.css";
import { Link } from "react-router-dom";

class SideNavigation extends Component {
  state = {};
  render() {
    return (
      <div className="side_nav">
        <Link className="menu_item" to="/">
          Dashboard
        </Link>
        <Link className="menu_item" to="/expenses">
          Expenses
        </Link>
        <Link className="menu_item" to="/investments">
          Investments
        </Link>
        <Link className="menu_item" to="/about">
          About
        </Link>
      </div>
    );
  }
}

export default SideNavigation;
