import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import "./style/main.css";

import { BrowserRouter as Router } from "react-router-dom";

//ReactDOM.render(<NavigationBar />, document.getElementById("top_nav"));
//ReactDOM.render(<SideNavigation />, document.getElementById("side_nav"));
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
