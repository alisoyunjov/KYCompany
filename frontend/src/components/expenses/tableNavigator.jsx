import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: "100%",
    minHeight: "52px",
    display: "flex",
    flexDirection: "row"
  },
  rowLabel: {
    marginLeft: "auto",
    flexShrink: "0",
    marginRight: "10px"
  },
  rowSelecor: {
    flexShrink: "0",
    marginLeft: "8px",
    marginRight: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  pageNumber: {
    flexShrink: "0",
    marginLeft: "5px"
  },
  prevPage: {
    marginLeft: "10px",
    padding: "12px"
  },
  nextPage: {
    padding: "12px"
  }
}));

export default function TableNavigator(props) {
  const {
    rowsPerPageOptions,
    rowsPerPage,
    page,
    onChangePage,
    maxPage,
    onChangeRowsPerPage
  } = props;
  const classes = useStyles();

  const goPrevPage = event => {
    if (page !== 0) {
      onChangePage(event, page - 1);
    }
  };

  const goNextPage = event => {
    if (page < maxPage) {
      onChangePage(event, page + 1);
    }
  };

  return (
    <div className={classes.mainContainer}>
      <p className={classes.rowLabel}>Rows per page:</p>
      <div className={classes.rowSelecor}>
        <Select
          labelId="demo-simple-select-label"
          id="num-row-select"
          value={rowsPerPage}
          onChange={onChangeRowsPerPage}
        >
          {rowsPerPageOptions.map((item, index) => {
            return (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
      </div>
      <p className={classes.pageNumber}>-{page + 1}-</p>
      <IconButton
        aria-label="prev"
        className={classes.prevPage}
        disabled={page === 0}
        size="small"
        onClick={goPrevPage}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton
        aria-label="next"
        className={classes.nextPage}
        disabled={page >= maxPage}
        size="small"
        onClick={goNextPage}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
    </div>
  );
}
