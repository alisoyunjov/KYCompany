import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

function Title(props) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node
};

export default function InvestDash() {
  const [data, setData] = useState({
    expenses_total: 0
  });

  useEffect(() => {
    console.log("EFFECT");
    // TODO: axios to fetch this data and setData
    setData({
      expenses_total: 0
    });
  }, []);

  return (
    <React.Fragment>
      <Title>Investments</Title>
      <h1>${data.expenses_total}</h1>
    </React.Fragment>
  );
}
