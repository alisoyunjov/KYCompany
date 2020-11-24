import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Typography from "@material-ui/core/Typography";
import FilterListIcon from "@material-ui/icons/FilterList";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import MomentUtils from "@date-io/moment";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { categories, util } from "../util";

// Filter starter code is from:
// https://material-ui.com/components/expansion-panels/

const useStyles = makeStyles(theme => ({
  root: {
    width: "90%",
    margin: "20px"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  details: {
    alignItems: "center"
  },
  column: {
    flexBasis: "33.33%"
  },
  date: {
    margin: "0px 10px"
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  flexRow: {
    margin: "5px",
    padding: "5px"
  },
  dateClass: {
    display: "flex",
    flexDirection: "row"
  },
  categoryForm: {
    minWidth: "150px"
  }
}));

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250
    }
  }
};

export default function ExpenseFilter(props) {
  const { onSubmit } = props;
  const [open, setOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState(util.getFirstDayOfMonth());
  const [endDate, setEndDate] = React.useState(new Date());
  const [categorySelected, setCategorySelected] = React.useState([]);
  const [paymentSelected, setPaymentSelected] = React.useState([]);
  const [type, setType] = React.useState("all");
  const classes = useStyles();

  const toggleForm = () => {
    setOpen(!open);
  };

  const changeCategory = event => {
    setCategorySelected(event.target.value);
  };

  const changePayment = event => {
    setPaymentSelected(event.target.value);
  };

  const changeType = event => {
    setType(event.target.value);
  };

  const filterReset = () => {
    setStartDate(util.getFirstDayOfMonth());
    setEndDate(new Date());
    setCategorySelected([]);
    setPaymentSelected([]);
    setType("all");
  };

  const filterExpenses = () => {
    let cat = "[";
    if (categorySelected.length !== 0) {
      cat = cat.concat('"', categorySelected[0], '"');
      for (let i = 1; i < categorySelected.length; i++) {
        cat = cat.concat(',"', categorySelected[i], '"');
      }
    }
    cat = cat.concat("]");
    let pat = "[";
    if (paymentSelected.length !== 0) {
      pat = pat.concat('"', paymentSelected[0], '"');
      for (let i = 1; i < paymentSelected.length; i++) {
        pat = pat.concat(',"', paymentSelected[i], '"');
      }
    }
    pat = pat.concat("]");
    let t = "[]";
    if (type !== "all") t = "[".concat('"', type, '"]');

    let query = {
      category: cat,
      payment_type: pat,
      start: util.formatDateAPI(startDate),
      end: util.formatDateAPI(endDate),
      type: t
    };
    toggleForm();
    onSubmit(query);
  };

  /*
  const deleteCatChip = chip => () => {
    let i = categorySelected.findIndex(item => {
      return item === chip;
    });
    if (i !== -1) {
      let newList = categorySelected;
      newList.splice(i, 1);
      setCategorySelected(newList);
    }
  };*/

  return (
    <div className={classes.root}>
      <ExpansionPanel expanded={open}>
        <ExpansionPanelSummary
          expandIcon={<FilterListIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
          onClick={toggleForm}
        >
          <div className={classes.column}>
            <Typography className={classes.heading}>Search</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>
              Filter Expenses
            </Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <div className={classes.mainContainer}>
            <div className={classes.dateClass}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/DD/YYYY"
                  margin="normal"
                  id="expense_start_date"
                  label="Start Date"
                  value={startDate}
                  onChange={date => setStartDate(new Date(date._d))}
                  className={classes.date}
                  KeyboardButtonProps={{
                    "aria-label": "change date"
                  }}
                />
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/DD/YYYY"
                  margin="normal"
                  id="expense_end_date"
                  label="End Date"
                  value={endDate}
                  onChange={date => setEndDate(new Date(date._d))}
                  className={classes.date}
                  KeyboardButtonProps={{
                    "aria-label": "change date"
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className={classes.flexRow}>
              <FormControl className={classes.categoryForm}>
                <InputLabel id="category_label">Category</InputLabel>
                <Select
                  labelId="category_label"
                  id="select_cat"
                  multiple
                  value={categorySelected}
                  onChange={changeCategory}
                  input={<Input id="im_cat" />}
                  renderValue={selected => (
                    <div className={classes.chips}>
                      {selected.map(value => (
                        <Chip key={value} label={value} />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {categories.map(name => (
                    <MenuItem key={name} value={name.toLowerCase()}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className={classes.flexRow}>
              <FormControl className={classes.categoryForm}>
                <InputLabel id="payment_label">Payment Type</InputLabel>
                <Select
                  labelId="payment_label"
                  id="select_payment"
                  multiple
                  value={paymentSelected}
                  onChange={changePayment}
                  input={<Input id="in_pay" />}
                  renderValue={selected => (
                    <div className={classes.chips}>
                      {selected.map(value => (
                        <Chip
                          key={value}
                          label={value}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  <MenuItem value="credit">Credit</MenuItem>
                  <MenuItem value="debit">Debit</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className={classes.flexRow}>
              <FormControl className={classes.categoryForm}>
                <InputLabel id="ex_label">Expense Type</InputLabel>
                <Select
                  labelId="ex_label"
                  id="select_expayment"
                  value={type}
                  onChange={changeType}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="expense">Expenses</MenuItem>
                  <MenuItem value="income">Income</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button size="small" onClick={filterReset}>Reset</Button>
          <Button size="small" color="primary" onClick={filterExpenses}>
            Filter
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </div>
  );
}
