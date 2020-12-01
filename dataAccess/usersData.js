const executeQuery = require('../utilities/mongoConnect').executeQuery;
const db = "BioBuy";
const users_collection = "users";
const tokens_collection = "tokens";


exports.add_user = async (name, surname, email, role, password, salt) => {
    return await executeQuery(db, async (db) => await db.collection(users_collection).insertOne(
        {name: name, surname: surname, role: role, email: email, password: password, salt: salt}));
};

exports.user_signin = async (email, password) => {
    return await executeQuery(db, async (db) => await db.collection(users_collection).findOne(
        {email: email, password: password}));
};

exports.find_user_by_email = async (email) => {
    return await executeQuery(db, async (db) => await db.collection(users_collection).findOne(
        {email: email}));
};

exports.get_users = async () => {
    return await executeQuery(db, async (db) => await db.collection(users_collection).find(
        {}).toArray());
};

exports.find_user_by_surname = async (surname) => {
    return await executeQuery(db, async (db) => await db.collection(users_collection).findOne(
        {surname: surname}));
};



// exports.update_email = async (username, email) => {
//     return await executeQuery(db, async (db) => await db.collection(users_collection).updateOne(
//         {username: username}, {$set: {email: email}}));
// };
//
// exports.update_password = async (username, password, salt) => {
//     return await executeQuery(db, async (db) => await db.collection(users_collection).updateOne(
//         {username: username}, {$set: {password: password, salt: salt}}));
// };
//
// exports.update_salary = async (username, salary) => {
//     return await executeQuery(db, async (db) => await db.collection(users_collection).updateOne(
//         {username: username}, {$set: {salary: salary}}));
// };
//
// exports.save_token = async (username, token, email, password, salt) => {
//     await executeQuery(db, async (db) => await db.collection(tokens_collection).createIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 } ));
//     return await executeQuery(db, async (db) => await db.collection(tokens_collection).updateOne(
//         {username: username}, {$set: {token: token,  email: email, password: password, salt: salt, createdAt: new Date()}}, {upsert: true}));
// };
//
// exports.get_token = async (username) => {
//     return await executeQuery(db, async (db) => await db.collection(tokens_collection).findOne(
//         {username: username}));
// };