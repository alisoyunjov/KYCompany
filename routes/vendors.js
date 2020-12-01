const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cookie = require("cookie");
const {
    applyValidationRules,
    validate
} = require("../utilities/inputValidator");

const {
    add_vendor,
    edit_vendor,
    delete_vendor,
    get_vendors,
    find_vendor_by_name
} = require("../dataAccess/vendorsData");


const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//basic QA checkup
router.get("/", async function(req, res) {
    console.log("path /api/order/");

    res.status(200).send("/api/order/ in users controller");
});

//Add vendor

router.post(
    "/add", async function (req, res){

        console.log("path /api/vendor/add/");
        let vendor = {
            vendor_email: req.body.vendor_email,
            vendor_name: req.body.vendor_name
        };
        const exists_in_vendor_db = await find_vendor_by_name(vendor.vendor_name);

        if (exists_in_vendor_db) {
            return res
                .status(409)
                .json({ error: "Vendor with this name already exists" });
        }

        const result = await add_vendor(vendor);
        console.log(result.ops[0]._id);
        if(result) {
            res.status(200).json({message: "Added vendor"});
        }else {
            res.status(500).json({error: "Internal server error"});
        }

    }
);


router.patch(
    "/edit", async function (req, res){
        //TODO: Get the email from the cookie
        console.log("path /api/vendor/edit/");
        let order_id = req.body._id;
        let fields = {
            vendor_email: req.body.vendor_email,
            vendor_name: req.body.vendor_name
        };
        const result = await edit_vendor(order_id, fields);
        if(result) {
            res.status(200).json({message: `Updated a vendor with id: ${order_id}`});
        }else {
            res.status(500).json({error: "Internal server error"});
        }

    }
);


//retrieve all vendors
router.get('/all',async function (req, res) {
    console.log('GET path /api/vendor/all');
    const result = await get_vendors();
    result.forEach(item => {return console.log(item.date)});
    res.status(200).json(result);
});

// delete the vendor by id
router.delete('/:id', async function (req, res) {
    console.log('DELETE path /api/vendor/:id');
    const result = await delete_vendor(req.params.id);
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
