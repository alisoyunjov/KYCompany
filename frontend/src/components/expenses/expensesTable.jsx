import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import ExpenseAction from "./expenseActions";
import { util } from "../util";
import TableNavigator from "./tableNavigator";
import Tooltip from "@material-ui/core/Tooltip";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

/// Got start code/template from:
// https://material-ui.com/components/tables/

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "income_expense_flag",
    numeric: false,
    disablePadding: true,
    label: "",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
  {
    id: "category",
    numeric: false,
    disablePadding: false,
    label: "Category",
  },
  {
    id: "payment",
    numeric: true,
    disablePadding: false,
    label: "Payment Type",
  },
  { id: "amount", numeric: true, disablePadding: false, label: "Amount" },
  { id: "action", numeric: true, disablePadding: false, label: "Actions" },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === "date" || headCell.id === "amount" ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function ExpensesTable(props) {
  const { rows, onAdd } = props;
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const updateOnDelete = () => {
    onAdd();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "40%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell align="center">
                        {row.isExpense ? (
                          <Tooltip title="Expense" placement="top">
                            <FiberManualRecordIcon style={{ color: "red" }} />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Income" placement="top">
                            <FiberManualRecordIcon style={{ color: "green" }} />
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        {util.formatDate(row.date)}
                      </TableCell>
                      <TableCell align="left">{row.description}</TableCell>
                      <TableCell align="right">
                        {util.firstLetterUpper(row.category)}
                      </TableCell>
                      <TableCell align="right">
                        {util.firstLetterUpper(row.payment_type)}
                      </TableCell>
                      <TableCell align="right">
                        {util.formatToDollars(row.amount)}
                      </TableCell>
                      <TableCell align="right">
                        <ExpenseAction
                          user={props.user}
                          id={row.id}
                          onAdd={updateOnDelete}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TableNavigator
          rowsPerPageOptions={[5, 10, 25]}
          rowsPerPage={rowsPerPage}
          page={page}
          maxPage={Math.floor((rows.length - 1) / rowsPerPage)}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
