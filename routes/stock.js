/*  jshint esversion: 6  */

const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios").default;
const app = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const {
    applyValidationRules,
    validate
} = require("../utilities/inputValidator");

const isAuthenticated = function(req, res, next) {
    if (!req.session.username) return res.status(401).end("access denied");
    next();
};

/**
Init Mongodb
Admin Credentials: Alan_C09, mongodb1
*/
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Alan_C09:mongodb1@cluster0-jfjzg.gcp.mongodb.net/test?retryWrites=true&w=majority";

/**
Init Alphavantage
Alphavantage API Key : 2A83RBS24CKPREWG, CVVDSGOLST7W6SZ4
*/
let API_KEY = "CVVDSGOLST7W6SZ4";
const alpha = require('alphavantage')({ key: API_KEY });

/**
Init WorldTradingData
WorldTradingData API Key : NgGRGvI3FSDXvI0TisOzKMBndl3coJPF0hOMbeaIPAoC6arI65SSI70PdehG
*/
let WTD_API_KEY = "NgGRGvI3FSDXvI0TisOzKMBndl3coJPF0hOMbeaIPAoC6arI65SSI70PdehG";

// add user authentication later ->
/*
app.use(function (req, res, next){
    req.username = req.session.username;
    console.log("HTTP request", req.session, req.method, req.url, req.body);
    next();
});
*/

// fetch qty : dictionary of {ticker: qty}
app.get("/getQty/:username/", isAuthenticated, function (req, res) {
    let username = req.params.username;
    if(req.session.username !== username){
        return res.status(401).end("access denied");
    }
    const client = new MongoClient(uri, { useNewUrlParser: true });
    
    client.connect(function(err) {
		if (err) return res.status(500).end(err);
		
		const db = client.db("fintrack");
		db.collection("users").find({username: username }, {projection: {_id:0, qty:1} }).toArray(function (err, result) {
            if (err) return res.status(500).end(err);
            if (!result) return res.json("no tickers");
            console.log(result);
            client.close();
			return res.json(result);
		});
	});
   
});


// fetch buyatprice : dictionary of {ticker: buy at price}
app.get("/getBuyAt/:username/", isAuthenticated, function (req, res) {
    let username = req.params.username;
    if(req.session.username !== username){
        return res.status(401).end("access denied");
    }
    const client = new MongoClient(uri, { useNewUrlParser: true });
    
    client.connect(function(err) {
		if (err) return res.status(500).end(err);
		
		const db = client.db("fintrack");
		db.collection("users").find({username: username }, {projection: {_id:0, buyat:1} }).toArray(function (err, result) {
            if (err) return res.status(500).end(err);
            if (!result) return res.json("no tickers");
            console.log(result);
            client.close();
			return res.json(result);
		});
	});
   
});

// fetch all ticker symbols for given user
app.get("/getTickers/:username/", isAuthenticated, function (req, res) {
    let username = req.params.username;
    if(req.session.username !== username){
        return res.status(401).end("access denied");
    }
    const client = new MongoClient(uri, { useNewUrlParser: true });
    
    client.connect(function(err) {
		if (err) return res.status(500).end(err);
		
		const db = client.db("fintrack");
		db.collection("users").find({username: username }, {projection: {_id:0, tickers:1} }).toArray(function (err, result) {
            if (err) return res.status(500).end(err);
            if (!result) return res.json("no tickers");
            console.log("1:", result);
            client.close();
			return res.json(result);
		});
	});
});

// fetch time_series_intraday data for given ticker symbol
app.get("/intraday/:ticker/", function (req, res) {
    let ticker = req.params.ticker;
	alpha.data.intraday(ticker, outputsize="compact").then(data => {
        console.log(data);
        return res.json(data);
    });
});

// fetch time_series_daily data for given ticker symbol
app.get("/daily/:ticker/", function (req, res) {
    let ticker = req.params.ticker;
	alpha.data.daily(ticker, outputsize="compact").then(data => {
        return res.json(data);
    });
});

// fetch batch time_series_daily data for given ticker symbols "a,b,c"
app.get("/daily/batch/:tickers/", function (req, res) {
    let tickers = req.params.tickers;
    console.log("user tickers:", tickers);
	axios.get('https://api.worldtradingdata.com/api/v1/stock?symbol=' + tickers + '&api_token=' + WTD_API_KEY).then(response => {
		//console.log(response.data);
		return res.json(response.data);
    });
});

// add a ticker for a user
app.post("/addticker/:username/:ticker/", isAuthenticated, function (req, res) {
    let username = req.params.username;
    if(req.session.username !== username){
        return res.status(401).end("access denied");
    }
    let ticker = req.params.ticker;
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(function(err) {
        if (err) return res.status(500).end(err);
        
        const db = client.db("fintrack");
        db.collection("users").update({username: username}, {$addToSet: {tickers: ticker} }, function(err, response) {
            if (err) return res.status(500).end(err);
            console.log("1 ticker added");
            client.close();
            return res.json(response);
        });
    }); 
});

// add ticker qty for a user
app.post("/addqty/:username/:ticker/:qty", isAuthenticated, function (req, res) {
    let username = req.params.username;
    if(req.session.username !== username){
        return res.status(401).end("access denied");
    }
    let add = {};
    add[req.params.ticker] = req.params.qty;

    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(function(err) {
        if (err) return res.status(500).end(err);
        
        const db = client.db("fintrack");
        db.collection("users").update({username: username}, {$push: {"qty" : add }}, function(err, response) {
            if (err) return res.status(500).end(err);
            console.log("ticker quantity added");
            client.close();
            return res.json(response);
        });
    }); 
});

// add ticker buy-at price for a user
app.post("/addbuyat/:username/:ticker/:price", isAuthenticated, function (req, res) {
    let username = req.params.username;
    if(req.session.username !== username){
        return res.status(401).end("access denied");
    }
    let add = {};
    add[req.params.ticker] = req.params.price;

    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(function(err) {
        if (err) return res.status(500).end(err);
        
        const db = client.db("fintrack");
        db.collection("users").update({username: username}, {$push: {"buyat" : add }}, function(err, response) {
            if (err) return res.status(500).end(err);
            console.log("ticker buy-at price added");
            client.close();
            return res.json(response);
        });
    }); 
});

// remove a ticker for a user
app.delete("/removeticker/:username/:ticker/", isAuthenticated, function (req, res) {
    let username = req.params.username;
    if(req.session.username !== username){
        return res.status(401).end("access denied");
    }
    let ticker = req.params.ticker;
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(function(err) {
        if (err) return res.status(500).end(err);
        
        const db = client.db("fintrack");
        db.collection("users").update({username: username}, {$pull: { tickers: ticker} }, function(err, response) {
            if (err) return res.status(500).end(err);
            console.log("1 ticker deleted");
            client.close();
            return res.json(response);
        });
    }); 
});

//export the router
module.exports = app;