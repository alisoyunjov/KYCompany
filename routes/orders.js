const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cookie = require("cookie");
const upload = require('../utilities/mongoConnect').upload;
const {
    applyValidationRules,
    validate
} = require("../utilities/inputValidator");

const {
    add_order,
    update_order,
    get_orders,
    get_user_orders,
    delete_order
} = require("..//dataAccess/ordersData");


const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//basic QA checkup
router.get("/", async function(req, res) {
    console.log("path /api/order/");

    res.status(200).send("/api/order/ in users controller");
});

//Add order

router.post(
    "/add", upload.single('file'), async function (req, res){

        console.log("path /api/order/add/");

        let order = {
            user_email: req.body.user_email,
            vendor_1: req.body.vendor_1,
            vendor_2: req.body.vendor_2,
            category: req.body.category,
            catalog_1: req.body.catalog_1,
            catalog_2: req.body.catalog_2,
            description: req.body.description,
            requested_day: new Date(),
            ms_filename: req.file.filename,
            notes: null,
            price: null,
            submission: null,
            status: null
        };
        console.log(req.file.filename);
        const result = await add_order(order);
        console.log(result.ops[0]._id);
        if(result) {
            res.status(200).json({message: "Added order"});
        }else {
            res.status(500).json({error: "Internal server error"});
        }

    }
);


router.patch(
    "/update", async function (req, res){
        //TODO: Get the email from the cookie
        console.log("path /api/order/update/");
        let order_id = req.body._id;
        let order = {
            user_email: req.body.user_email,
            vendor_1: req.body.vendor_1,
            vendor_2: req.body.vendor_2,
            category: req.body.category,
            catalog_1: req.body.catalog_1,
            catalog_2: req.body.catalog_2,
            description: req.body.description,
            notes: null,
            price: null,
            submission: null,
            status: null
        };
        const result = await update_order(order_id, order);
        if(result) {
            res.status(200).json({message: `Updated an order with id: ${order_id}`});
        }else {
            res.status(500).json({error: "Internal server error"});
        }

    }
);

router.patch(
    "/admin/update", async function (req, res){
        console.log("path /api/order/admin/update/");
        let order_id = req.body._id;
        let order = {
            user_email: req.body.user_email,
            vendor_1: req.body.vendor_1,
            vendor_2: req.body.vendor_2,
            category: req.body.category,
            catalog_1: req.body.catalog_1,
            catalog_2: req.body.catalog_2,
            description: req.body.description,
            notes: req.body.notes,
            price: Number(req.body.price),
            submission: req.body.submission,
            status: req.body.status
        };
        const result = await update_order(order_id, order);
        if(result) {
            res.status(200).json({message: `Updated an order with id: ${order_id}`});
        }else {
            res.status(500).json({error: "Internal server error"});
        }
    }
);

//retrieve company orders by start and end date
// retrieve the expenses from page*limit to page*limit +1
router.get('/multiple',async function (req, res) {
    console.log('GET path /api/orders/multiple/');
    const page_number = parseInt(req.query.page_number);
    const page_limit = parseInt(req.query.page_limit);
    let {start=new Date('01/01/2000'), end=new Date()} = req.query;
    start = new Date(start);
    start = start.setHours(0,0,0);
    start = new Date(start);
    end = new Date(end);
    end = end.setHours(23, 59, 59);
    end = new Date(end);
    console.log(start, end);
    const result = await get_orders(page_number, page_limit, start, end);
    result.forEach(item => {return console.log(item.date)});
    res.status(200).json(result);
});

//retrieve user orders by start and end date
// retrieve the expenses from page*limit to page*limit +1
router.get('/multiple/:user_email',async function (req, res) {
    console.log('GET path /api/orders/multiple/');
    const user_email = req.params.user_email;
    const page_number = parseInt(req.query.page_number);
    const page_limit = parseInt(req.query.page_limit);
    let {start=new Date('01/01/2000'), end=new Date()} = req.query;
    start = new Date(start);
    start = start.setHours(0,0,0);
    start = new Date(start);
    end = new Date(end);
    end = end.setHours(23, 59, 59);
    end = new Date(end);
    console.log(start, end);
    const result = await get_user_orders(user_email, page_number, page_limit, start, end);
    result.forEach(item => {return console.log(item.date)});
    res.status(200).json(result);
});

// delete the orders by id
router.delete('/:id', async function (req, res) {
    console.log('DELETE path /api/orders/:id');
    const result = await delete_order(req.params.id);
    if(result.deletedCount){
        res.status(200).send({message: `order with id: ${req.params.id} has been deleted!`});
    }
    res.status(404).send({error: `order with id: ${req.params.id} not found!`});
});

router.get("/isauthenticated", function(req, res) {
    if (req.session.username)
        return res.json({ isauth: true, username: req.session.username });
    return res.json({ isauth: false, username: null });
});


//export the router
module.exports = router;
