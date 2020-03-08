const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
const {add_expense, get_expense_by_id, delete_expense, get_expenses, get_expenses_by_month} = require("../dataAccess/expensesData");
const {
    applyValidationRules,
    validate
} = require("../utilities/inputValidator");

//create a new expense
router.post('/',applyValidationRules("create expense"), validate, async function (req, res) {
    console.log('POST path /expense/');
    const expense = {
        username: req.body.username,
        category: req.body.category,
        type: req.body.type,
        amount: parseFloat(req.body.amount),
        date: new Date(),
        payment_type: req.body.payment_type,
        description: req.body.description
    };
    const result = await add_expense(expense);
    if(result) {
        return res.status(200).json(result.ops[0]);
    }
    return res.status(500).json({error: "Internal server error"});
});
//retrieve the expense by id
router.get('/:id', async function (req, res) {
    console.log('GET path /api/expense/:id');
    const expense = await get_expense_by_id(req.params.id);
    if(expense){
        return res.status(200).json(expense);
    }
    return res.status(404).json({error:`An expense with id ${req.query.id} not found`});
});

// retrieve the expenses from page*limit to page*limit +1
router.get('/multiple/:username', applyValidationRules("get expenses"), validate,async function (req, res) {
    console.log('GET path /api/expense/multiple/:username');
    const username = req.params.username;
    const page_number = parseInt(req.query.page_number);
    const page_limit = parseInt(req.query.page_limit);
    const {category=".*", payment_type=".*"} = req.query;
    const result = await get_expenses(page_number, page_limit, username, category, payment_type);
    res.status(200).json(result);
});

//retrieve the expenses from page*limit to page*limit +1 in specific month
router.get('/multiple/:username/:month', applyValidationRules("get expenses by month"), validate, async function (req, res) {
    console.log('GET path /api/expense/multiple/:username/:month');
    const month = parseInt(req.params.month);
    const page_number = parseInt(req.query.page_number);
    const page_limit = parseInt(req.query.page_limit);
    const username = req.params.username;
    const {category=".*", payment_type=".*"} = req.query;
    const result = await get_expenses_by_month(username, month, page_number, page_limit, category, payment_type);
    res.status(200).json(result);
});

// delete the expense by id and all associated comments
router.delete('/:id', async function (req, res) {
    console.log('DELETE path /api/expense/:id');
    const result = await delete_expense(req.params.id);
    if(result.deletedCount){
        res.status(200).send({message: `expense with id: ${req.query.id} has been deleted!`});
    }
    res.status(404).send({error: `expense with id: ${req.query.id} not found!`});
});

//export the router
module.exports = router;
