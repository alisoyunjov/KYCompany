import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

export default function MainTitle(props) {
  return (
    <Typography component="h1" variant="h2" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

MainTitle.propTypes = {
  children: PropTypes.node
};
