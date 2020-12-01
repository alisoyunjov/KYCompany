const executeQuery = require('../utilities/mongoConnect').executeQuery;
const db = "BioBuy";
const orders_collection = "orders";
ObjectId = require('mongodb').ObjectID;



exports.add_order = async (order) => {
    return await executeQuery(db, async (db) => await db.collection(orders_collection).insertOne(
        {user_email: order.user_email, vendor_1: order.vendor_1, vendor_2: order.vendor_2, category: order.category, catalog_1: order.catalog_1, catalog_2: order.catalog_2,
        description: order.description, requested_day: order.requested_day, ms_filename: order.ms_filename, notes: order.notes, price: order.price, submission: order.submission, status: order.status}));
};

exports.update_order = async (order_id, fields) => {
    const _id = ObjectId(order_id);
    return await executeQuery(db, async (db) => await db.collection(orders_collection).updateOne(
        {_id: _id}, {$set: fields}));
};

exports.get_images = async () => {
    return await executeQuery(db, async (db) => await db.collection("photos.chunks").findOne({}));
};

exports.get_orders = async (page_number, page_limit, start, end) => {
    const skips = (page_number - 1)*page_limit;
    return await executeQuery(db, async (db) => await db.collection(orders_collection).find(
        {requested_day: {"$gte": start, "$lte": end}}).sort({requested_day: -1}).skip(skips).limit(page_limit).toArray());
};

exports.get_user_orders = async (user_email, page_number, page_limit, start, end) => {
    const skips = (page_number - 1)*page_limit;
    return await executeQuery(db, async (db) => await db.collection(orders_collection).find(
        {user_email: user_email, requested_day: {"$gte": start, "$lte": end}}).sort({requested_day: -1}).skip(skips).limit(page_limit).toArray())
};

exports.delete_order = async (id) => {
    const _id = ObjectId(id);
    return await executeQuery(db, async (db) => await db.collection(orders_collection).deleteOne(
        {_id: _id}));
};
// exports.user_signin = async (email, password) => {
//     return await executeQuery(db, async (db) => await db.collection(users_collection).findOne(
//         {email: email, password: password}));
// };
//
// exports.find_user_by_email = async (email) => {
//     return await executeQuery(db, async (db) => await db.collection(users_collection).findOne(
//         {email: email}));
// };
//
// exports.get_users = async () => {
//     return await executeQuery(db, async (db) => await db.collection(users_collection).find(
//         {}).toArray());
// };
//
// exports.find_user_by_surname = async (surname) => {
//     return await executeQuery(db, async (db) => await db.collection(users_collection).findOne(
//         {surname: surname}));
// };