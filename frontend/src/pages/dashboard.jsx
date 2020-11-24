import React from "react";
import "../style/main.css";
import "../style/dashboard.css";
import ExpenseDash from "../components/dashboard/expenseOverview";
import NewsDash from "../components/dashboard/newsOverview";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import MainTitle from "../components/pageTitle";

const styles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dash_item: {
    width: "350px",
    margin: "24px",
  },
  paper: {
    padding: "5px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },
  fixedHeight: {
    height: "200px",
  },
  hover_paper: {
    cursor: "pointer !important",
    border: "1px solid black",

    "&:hover": {
      border: "1px solid black",
      boxShadow: "10px 5px 5px grey",
    },
  },
  expandedDashItem: {
    height: "500px",
    width: "max(800px, 80%)",
    margin: "24px",
  },
}));

export default function DashBoard(props) {
  const { user } = props;
  const classes = styles();
  const [expDashClass, setExpDashClass] = React.useState(
    clsx(classes.fixedHeight, classes.dash_item)
  );
  const [expExpanded, setExpExpanded] = React.useState(false);

  const expandExpDash = () => {
    let cl = !expExpanded
      ? clsx(classes.expandedDashItem)
      : clsx(classes.fixedHeight, classes.dash_item);
    setExpDashClass(cl);
    setExpExpanded(!expExpanded);
  };

  return (
    <main className={classes.content}>
      <MainTitle>DashBoard</MainTitle>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <div className={expDashClass}>
          <Paper
            className={clsx(classes.paper, classes.hover_paper)}
            onClick={expandExpDash}
          >
            <ExpenseDash user={user} expanded={expExpanded} />
          </Paper>
        </div>
      </Container>
      <NewsDash />
    </main>
  );
}
