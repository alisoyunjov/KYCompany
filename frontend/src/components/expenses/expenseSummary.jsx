import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Paper from "@material-ui/core/Paper";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  categories,
  categories_zeroVal,
  payment_types_zeroVal,
  payment_types,
  util,
} from "../util";

const Plot = createPlotlyComponent(Plotly);

// Filter starter code is from:
// https://material-ui.com/components/expansion-panels/

const useStyles = makeStyles((theme) => ({
  root: {
    width: "90%",
    margin: "20px",
  },
  loading: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  paper: {
    padding: "5px",
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "500px",
  },
  hover_paper: {
    border: "1px solid black",
    "&:hover": {
      border: "1px solid black",
      boxShadow: "10px 5px 5px grey",
    },
  },
  totals: {
    paddingLeft: "5px",
    paddingTop: "170px",
    fontSize: "25px",
    height: "100%",
    verticalAlign: "middle",
  },
  header1: {
    fontWeight: "bold",
  },
}));

export default function ExpenseSummary(props) {
  const { rows } = props;
  const [loading, setLoading] = React.useState(true);
  const [catValues, setCatValues] = React.useState([]);
  const [catText, setCatText] = React.useState([]);
  const [paTValue, setPaTValue] = React.useState([]);
  const [paTText, setPatTText] = React.useState([]);
  const [totalExpense, setTotalExpense] = React.useState(0);
  const [totalIncome, setTotalIncome] = React.useState(0);
  const classes = useStyles();

  React.useEffect(() => {
    if (loading) {
      let cVal = categories_zeroVal.slice();
      let pVal = payment_types_zeroVal.slice();
      let expenseTotal = 0;
      let incomeTotal = 0;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].isExpense) {
          let cIndex = categories.indexOf(
            util.firstLetterUpper(rows[i].category)
          );
          let pIndex = payment_types.indexOf(
            util.firstLetterUpper(rows[i].payment_type)
          );
          cVal[cIndex] += rows[i].amount;
          pVal[pIndex] += rows[i].amount;
          expenseTotal += rows[i].amount;
        } else {
          incomeTotal += rows[i].amount;
        }
      }
      setCatValues(cVal);
      setCatText(cVal.map(util.formatToDollars));
      setPaTValue(pVal);
      setPatTText(pVal.map(util.formatToDollars));
      setTotalExpense(expenseTotal);
      setTotalIncome(incomeTotal);
      setLoading(false);
    }
  }, [rows, loading]);

  return (
    <div className={classes.root}>
      {loading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          <Paper className={clsx(classes.paper, classes.hover_paper)}>
            {totalExpense !== 0 ? (
              <Plot
                data={[
                  {
                    type: "pie",
                    values: catValues,
                    labels: categories,
                    text: catText,
                    textinfo: "label",
                    hoverinfo: "none",
                    hovertemplate:
                      "<extra></extra>%{label} <br>Amount: %{text}",
                  },
                ]}
                style={{ width: "45%" }}
              />
            ) : (
              ""
            )}
            {totalExpense !== 0 ? (
              <Plot
                data={[
                  {
                    type: "pie",
                    values: paTValue,
                    labels: payment_types,
                    text: paTText,
                    textinfo: "label",
                    hoverinfo: "none",
                    hovertemplate:
                      "<extra></extra>%{label} <br>Amount: %{text}",
                  },
                ]}
                style={{ width: "40%" }}
              />
            ) : (
              ""
            )}
            <div className={classes.totals}>
              <div className={classes.header1}>Total Expenses </div>
              <div style={{ color: "red" }}>
                {" "}
                {util.formatToDollars(totalExpense)}
              </div>
              <div className={classes.header1}>Total Income</div>
              <div style={{ color: "green" }}>
                {" "}
                {util.formatToDollars(totalIncome)}
              </div>
            </div>
          </Paper>
        </div>
      )}
    </div>
  );
}
