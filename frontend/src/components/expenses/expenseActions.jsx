import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddExpenseDialog from "./addExpense";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const ITEM_HEIGHT = 48;

const NewDialog = withStyles({
  paper: {
    height: "70px",
    width: "70px"
  }
})(Dialog);

const useStyles = makeStyles(() => ({
  loading: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

export default function ExpenseActions(props) {
  const { onAdd } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = value => {
    setOpenEdit(false);
    return <Redirect to="/expenses" />;
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    // Delete msg
    setLoading(true);
    axios
      .delete("/api/expense/".concat(props.id), {})
      .then(res => {
        if (res.status === 200) {
          setLoading(false);
          handleClose();
          onAdd();
        }
      })
      .catch(err => {
        console.log("Error", err.response);
      });
  };

  const handleEdit = () => {
    // Edit msg
    handleClose();
    handleClickOpen();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200
          }
        }}
      >
        <MenuItem key="delete" onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
        <MenuItem key="edit" onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
      </Menu>
      <AddExpenseDialog
        id={props.id}
        user={props.user}
        open={openEdit}
        onClose={handleCloseEdit}
        onAdd={onAdd}
      />
      <NewDialog disableBackdropClick open={loading}>
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      </NewDialog>
    </div>
  );
}
