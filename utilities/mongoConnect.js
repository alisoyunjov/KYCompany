const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const path = require('path');
const config_param = fs.readFileSync(path.resolve(__dirname, "../config.json"), 'utf-8');
const configJson = JSON.parse(config_param);
const mongodbUrl = `mongodb+srv://${configJson.mongo.user}:${configJson.mongo.password}@cluster0.2g0d0.mongodb.net/BioBuy?retryWrites=true&w=majority`;
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

const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

let storage = new GridFsStorage({
    url: mongodbUrl,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return {
            bucketName: "ms_file",
            filename: `${Date.now()}-biobuy-${file.originalname}`
        };
    }
});

exports.upload = multer({storage: storage});


