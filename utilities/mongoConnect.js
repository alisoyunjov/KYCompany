const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const path = require('path');
const config_param = fs.readFileSync(path.resolve(__dirname, "../config.json"), 'utf-8');
const configJson = JSON.parse(config_param);
const mongodbUrl = `mongodb+srv://${configJson.mongo.user}:${configJson.mongo.password}@cluster0.2g0d0.mongodb.net/biobuy?retryWrites=true&w=majority`;
const connectMongo = () => new Promise(async (resolve, reject) => {
    if (configJson) {
        try {
            resolve(await MongoClient.connect(mongodbUrl, {useNewUrlParser: true, useUnifiedTopology: true}));
        } catch (err) {
            reject(err);
        }
    }
});
exports.executeQuery = async (dbName, callbackPromise) => {
    try {
        const client = await connectMongo();
        let result;
        try {
            const db = client.db(dbName);
            result = await callbackPromise(db);
        } catch (err) {
            console.error(err);
        }
        client.close();
        return result;
    } catch (err) {
        console.error(err);
    }
};
