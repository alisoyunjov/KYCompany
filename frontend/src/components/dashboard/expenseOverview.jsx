import React, { useState, useEffect } from "react";
import { util, categories } from "../util";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

const Plot = createPlotlyComponent(Plotly);

function Title(props) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};

const styles = makeStyles((theme) => ({
  expenseText: {
    color: "red",
    fontSize: "35px",
  },
  incomeText: {
    color: "green",
    fontSize: "35px",
  },
  netIncomeText: {
    color: "black",
    fontWeight: "bold",
    fontSize: "35px",
  },
  mainFrame: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  paperClass: {
    width: "100%",
    height: "100%",
  },
  sumCol: {
    height: "100%",
  },
  graphCol: {
    flex: 2,
  },
  loading: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function ExpenseDash(props) {
  const { user, expanded } = props;
  const [expenseSum, setExpenseSum] = useState(0);
  const [incomeSum, setIncomeSum] = useState(0);
  const [month, setMonth] = React.useState("");
  const [categoryValue, setCategoryValue] = React.useState([]);
  const [categoryText, setCategoryText] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const classes = styles();

  useEffect(() => {
    setLoading(true);

    (async function getData() {
      axios
        .get("/api/user/info/".concat(user))
        .then((response) => {
          axios
            .get(
              "/api/expense/multiple-sum/".concat(
                user,
                "/",
                new Date().getMonth() + 1,
                '?page_number=1&page_limit=1000&payment_types=[]&types=["income"]&categories=[]'
              )
            )
            .then((resIn) => {
              let s = response.data.salary ? response.data.salary : 0;
              setIncomeSum(s + resIn.data.sum);
            })
            .catch((err) => {
              console.log(err.response);
            });
        })
        .catch((err) => {
          console.log(err.response);
        });
      // TODO: axios to fetch this data and setData
      let exData = [];
      let exSum = 0;
      for (let i = 0; i < categories.length; i++) {
        try {
          let res = await axios.get(
            "/api/expense/multiple-sum/".concat(
              user,
              "/",
              new Date().getMonth() + 1,
              '?page_number=1&page_limit=1000&payment_types=[]&types=["expense"]&categories=["',
              categories[i].toLowerCase(),
              '"]'
            )
          );
          exSum += res.data.sum;
          exData.push(res.data.sum);
        } catch (err) {
          console.log(err.response);
        }
      }
      setExpenseSum(exSum);
      setMonth(util.getCurrentMonth());
      setCategoryValue(exData);
      setCategoryText(exData.map(util.formatToDollars));
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className={classes.paperClass}>
      {loading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.mainFrame}>
          <div className={classes.sumCol}>
            <Title>Expenses: {month}</Title>

            <Tooltip title="Expenses" placement="left">
              <div className={classes.expenseText}>
                {util.formatToDollars(expenseSum)}
              </div>
            </Tooltip>
            <Tooltip title="Income" placement="left">
              <div className={classes.incomeText}>
                {util.formatToDollars(incomeSum)}
              </div>
            </Tooltip>
            <Tooltip title="Net Margin" placement="left">
              <div className={classes.netIncomeText}>
                {incomeSum >= expenseSum ? "+" : "-"}
                {util.formatToDollars(Math.abs(incomeSum - expenseSum))}
              </div>
            </Tooltip>
          </div>
          {expanded ? (
            <div className={classes.graphCol}>
              <Plot
                data={[
                  {
                    type: "pie",
                    values: categoryValue,
                    labels: categories,
                    text: categoryText,
                    textinfo: "label",
                    hoverinfo: "none",
                    hovertemplate:
                      "<extra></extra>%{label} <br>Amount: %{text}",
                  },
                ]}
                style={{ width: "100%", height: "100%" }}
              ></Plot>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}
