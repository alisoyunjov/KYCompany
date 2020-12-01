const executeQuery = require('../utilities/mongoConnect').executeQuery;
const db = "BioBuy";
const vendors_collection = "vendors";
ObjectId = require('mongodb').ObjectID;



exports.add_vendor = async (vendor) => {
    return await executeQuery(db, async (db) => await db.collection(vendors_collection).insertOne(
        {vendor_email: vendor.vendor_email, vendor_name: vendor.vendor_name}));
};

exports.edit_vendor = async (vendor_id, fields) => {
    const _id = ObjectId(vendor_id);
    return await executeQuery(db, async (db) => await db.collection(vendors_collection).updateOne(
        {_id: _id}, {$set: fields}));
};


exports.get_vendors = async () => {
    return await executeQuery(db, async (db) => await db.collection(vendors_collection).find(
        {}).sort().toArray());
};

exports.delete_vendor = async (id) => {
    const _id = ObjectId(id);
    return await executeQuery(db, async (db) => await db.collection(vendors_collection).deleteOne(
        {_id: _id}));
};

exports.find_vendor_by_name = async (vendor_name) => {
    return await executeQuery(db, async (db) => await db.collection(vendors_collection).findOne(
        {vendor_name: vendor_name}));
};