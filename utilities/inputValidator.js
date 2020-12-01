const { check, validationResult } = require('express-validator');

exports.applyValidationRules = (endpoint) => {
    console.log("endpoint: ", endpoint);
    switch (endpoint) {
        case '/signup': {
            return [
                check('name').isLength({min: 5}).withMessage("The name should be at least five characters long"),
                check('password').isLength({min: 5}).withMessage("Your password should be at least five characters long"),
                check('email').isEmail().withMessage("Please write a valid email")
            ];
        }
        case "/signin": {
            return [
                check('email').isEmail().withMessage("Please write a valid email"),
                check('password').isLength({min: 5}).withMessage("Your password should be at least five characters long"),
            ];
        }
        case "/profile/salary": {
            return [
                check('username').isLength({min: 5}).withMessage("Invalid username"),
                check('salary').isNumeric().withMessage("The salary should be a number"),
            ];
        }
        case "/profile/email": {
            return [
                check('username').isLength({min: 5}).withMessage("Invalid username"),
                check('email').isEmail().withMessage("Invalid Email"),
            ];
        }
        case "/profile/password": {
            return [
                check('username').isLength({min: 5}).withMessage("Invalid username"),
                check('new_password').isLength({min: 5}).withMessage("Your password should be at least five characters long"),
                check('old_password').isLength({min: 5}).withMessage("Your password should be at least five characters long"),

            ];
        }
        case "create expense": {
            return [
                check('username').isLength({min: 5}).withMessage("Invalid username"),
                check('type').isIn(["income", "expense"]).withMessage("The type of the expense should be either income or expense"),
                check('payment_type').isIn(["cash", "credit", "debit"]).withMessage("Te payment type should be cash, credit or debit"),
                check('date').matches(/^((19|20)?[0-9]{2}[- /.](0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01]))/).withMessage("Invalid Date. Please follow this structure: yyyy/mm/dd and then time.")
            ];
        }
        case "update expense": {
            return [
                check('type').isIn(["income", "expense"]).withMessage("The type of the expense should be either income or expense"),
                check('payment_type').isIn(["cash", "credit", "debit"]).withMessage("Te payment type should be cash, credit or debit"),
            ];
        }
        case "get expenses": {
            return [
                check('username').isLength({min: 5}).withMessage("Invalid username"),
                check('start').matches(/^((19|20)?[0-9]{2}[- /.](0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01]))/).withMessage("Invalid Date. Please follow this structure: yyyy/mm/dd and then time."),
                check('end').matches(/^((19|20)?[0-9]{2}[- /.](0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01]))/).withMessage("Invalid Date. Please follow this structure: yyyy/mm/dd and then time.")
            ];
        }
        case "get expenses sum": {
            return [
                check('username').isLength({min: 5}).withMessage("Invalid username"),
                check('start').matches(/^((19|20)?[0-9]{2}[- /.](0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01]))/).withMessage("Invalid Date. Please follow this structure: yyyy/mm/dd and then time."),
                check('end').matches(/^((19|20)?[0-9]{2}[- /.](0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01]))/).withMessage("Invalid Date. Please follow this structure: yyyy/mm/dd and then time.")
            ];
        }

        case "get expenses by month": {
            return [
                check('month').isIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).withMessage("Invalid month. Month can be from 1-12"),
                check('username').isLength({min: 5}).withMessage("Invalid username"),
               ];
        }

        case "get expenses sum by month": {
            return [
                check('month').isIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).withMessage("Invalid month. Month can be from 1-12"),
                check('username').isLength({min: 5}).withMessage("Invalid username"),
                ];
        }
    }
};

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    let error = "";
    errors.array().forEach(err => error = error + ". " + err.msg );

    return res.status(422).json({
        error: error,
    });
};