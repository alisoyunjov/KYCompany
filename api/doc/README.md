# FinTrack REST API Documentation

## Signup / Signin

- description: Sign up a new user
- request: `POST api/user/signup/`
  - content-type: `application/json`
  - body: object
    - username: (string) unique username
    - email: email for user (must be unique)
    - password: (string) password for user
- response: 200
  - content-type: `application/json`
  - body: (string) Email with token sent

```
$ curl -X POST
       -H "Content-Type: `application/json`"
       -d '{"username":"me","email": "asd@fas.com","password":"pass"}
       http://localhost:5000/api/user/signup/'
```

- description: ValidateToken
- request: `POST api/user/validateToken`
  - content-type: `application/json`
  - body: object
    - username: (string) unique username
    - token: (number) token that was sent to user's email
    - password: (string) password for user
- response: 200
  - content-type: `application/json`
  - body: (string) User signed up

```
$ curl -X POST
       -H "Content-Type: `application/json`"
       -d '{"username":"me","token": "123456","password":"pass"}
       http://localhost:5000/api/user/validateToken/'
```

- description: Sign in as existing user
- request: `POST /api/user/signin/first`
  - content-type: `application/json`
  - body: object
    - username: (string) unique username
    - password: (string) password for user
- response: 200
  - content-type: `application/json`
  - body: (string) User signed in

```
$ curl -X POST
       -H "Content-Type: `application/json`"
       -d '{"username":"me","password":"pass"}
       -c cookie.txt
       http://localhost:5000/api/user/signin/first'
```


- description: Sign out of session (destory session)
- request: `POST /api/user/signout/`
- response: 200

```
$ curl -X POST
       -c cookie.txt
       http://localhost:3000/api/user/signout/'
```

---

- description: Enter/update salary information
- request: `PATCH /api/user/profile/salary`
  - content-type: `application/json`
  - body: object
    - salary: (float) income per month
- response: 200

---

- description: Change primary email address
- request: `PATCH /api/user/profile/email`
  - content-type: `application/json`
  - body: object
    - email: (string) unique email to replace one from set up
- response: 200

---

- description: Change user password
- request: `PATCH /api/user/profile/password`
  - content-type: `application/json`
  - body: object
    - username
    - old_password
    - new_password: (string) new Password must be different from old
- response: 200

---

All the below api require a session from the above login api

## Expenses API

### Create

- description: create a new expense
- request: `POST /api/expense/`
  - content-type: `application/json`
  - session
  - body: object
    - username: (string) the username of the user
<<<<<<< Updated upstream
    - category: (string) the category of expense
=======
    - type: (string) the type of expense
>>>>>>> Stashed changes
    - amount: (float) the amount of the expense
    - payment_type: (cash|credit|debit)
    - type: (income|expense)
    - description: (string) description
- response: 200
  - content-type: `application/json`
  - body: object
    - username: (string) the username of the user
    - \_id: (string) the expenses id
    - category: (string) the category of expense
    - amount: (float) the amount of the expense
    - date: (date) date
    - type: (income|expense)
    - payment_type: (cash|credit|debit)
    - description: (string) description

---

### Get Expense

- description: retrieve the expenses that is stored
- request: `GET /api/expense/:id/`
- response: 200
  - content-type: `application/json`
  - body: object
    - username: (string) the username of the user
    - \_id: (string) the expenses id
    - category: (string) the category of expense
    - amount: (float) the amount of the expense
    - date: (date) date
    - payment_type: (cash|credit|debit)
    - type: (income|expense)
    - description: (string) description
- response: 404
  - body: expenses id does not exists

---

- description: retrieve the expenses from page\*limit to page\*limit +1
- request: `GET /api/expense/multiple/:username`
  - request parameters:
  - content-type: `application/json
  - query parameters:
    - page_number: (int) page number (starts with 1)
    - page limit: (int) page limit
    - categories: An array. input [] if you want all categories.
    - payment_types: An array. input [] if you want all payment_types.
    - types: An array. input [] if you want all types.
    - start: mm/dd/yyyy
    - end: mm/dd/yyyy
- response: 200
  - content-type: `application/json`
  - body: list

    - username: (string) the username of the user

    - \_id: (string) the expenses id
    - category: (string) the category of expense
    - amount: (float) the amount of the expense
    - date: (date) date
    - payment_type: (cash|credit|debit)
    - description: (string) description
    
    ```
    $ curl -b cookie.txt -X GET
        localhost:5000/api/expense/multiple/ram11/3?page_number=1&page_limit=10&payment_types=["cash", "debit"]&types=["expense"]&categories=[]&start=01/01/2020&end=03/18/2020
    ```
---

- description: retrieve the expenses from page\*limit to page\*limit +1 in the month, month
- request: `GET /api/expenses/:username/:month`
  - content-type: `application/json
  - query parameters:
    - page_number: (int) page number (starts with 1)
    - page_limit: (int) page limit
    - categories: An array. input [] if you want all categories.
    - payment_types: An array. input [] if you want all payment_types.
    - types: An array. input [] if you want all types.
- response: 200
  - content-type: `application/json`
  - body: list
    - username: (string) the username of the user
    - \_id: (string) the expenses id
    - category: (string) the category of expense
    - amount: (float) the amount of the expense
    - date: (date) date
    - payment_type: (cash|credit|debit)
    - description: (string) description

```
$ curl -b cookie.txt -X GET
       localhost:5000/api/expense/multiple/ram11/3?page_number=1&page_limit=10&payment_types=["cash", "debit"]&types=["expense"]&categories=[]
```

- description: retrieve the expenses from page\*limit to page\*limit +1 in the month, month
- request: `GET /api/expenses/:username/:month/overview`
  - content-type: `application/json
- response: 200
  - content-type: `application/json`
  - body: object
    - total_expenses: (float) sum of all expenses for month
    - total_income: (float) sum of all income for month

### Delete

- description: delete the expenses id and all assosiated comments
- request: `DELETE /api/expenses/:id/`
- response: 200
  - content-type: `application/json`
  - body: object
    - success: (string) => expense with id: <\_id> has been deleted!
- response: 404
  - body: object
    - error: (string) => expense with id: <\_id> not found!


```
$ curl -b cookie.txt -X DELETE
       http://localhost:3003/api/expenses/jed5672jd90xg4awo789/
```
## News

###Get latest Bloomberg news

- description: Get latest news
- request: `GET /api/news/`
- response: 200
  - content-type: `application/json`
  - body: object

```
$ curl -b cookie.txt -X DELETE
       http://localhost:500/api/news
```

## Investments API

### Get investments

- description: retrieve the stock tickers tracked by user
- request: `GET /api/investments/getTickers/:username/`
- session
- response: 200
  - content-type: `application/json`
  - body: list
    - dictionary of comma-separated tickers: {a,b,c}
- response: 500
  - body: no tickers

```
$ curl -b tickers.txt -X GET
    localhost:5000/api/investments/getTickers/ram11/
```
---

- description: retrieve the quantity of each stock tracked by user
- request: `GET /api/investments/getQty/:username/`
- session
- response: 200
  - content-type: `application/json`
  - body: list
    - dictionary of ticker:quantity : {a:5,b:10,c:1}
- response: 500
  - body: no tickers

```
$ curl -b tickers.txt -X GET
    localhost:5000/api/investments/getQty/ram11/
```
---

- description: retrieve the buy-at price of each stock tracked by user
- request: `GET /api/investments/getBuyAt/:username/`
- session
- response: 200
  - content-type: `application/json`
  - body: list
    - dictionary of ticker:buyatprice : {a:80,b:98,c:70}
- response: 500
  - body: no tickers

```
$ curl -b tickers.txt -X GET
    localhost:5000/api/investments/getBuyAt/ram11/
```
---

- description: retrieve intraday time series data for a given stock (from Alphavantange API)
- request: `GET /api/investments/intraday/:ticker/`
- response: 200
  - content-type: `application/json`
  - body: object
    - Time Series (5min) : object
      - Date & Timeframe - date and timeframe of stock quote : object
        - 1. open : (string) open price on start of timeframe
        - 2. high : (string) high price on this timeframe
        - 3. low : (string) low price on this timeframe
        - 4. close : (string) close price on end of timeframe
        - 5. volume : (string) volume traded on timeframe
- response: 500
  - body: Alphavantange API error

```
$ curl -b tickers.txt -X GET
    localhost:5000/api/investments/intraday/TWTR/
```
---

- description: retrieve daily time series data for a given stock (from Alphavantange API)
- request: `GET /api/investments/daily/:ticker/`
- response: 200
  - content-type: `application/json`
  - body: object
    - Time Series (Daily) : object
      - Date - date : object
        - 1. open : (string) open price on date open
        - 2. high : (string) high price on day
        - 3. low : (string) low price on day
        - 4. close : (string) close price on end of day
        - 5. volume : (string) volume traded on day
- response: 500
  - body: Alphavantange API error

```
$ curl -b tickers.txt -X GET
    localhost:5000/api/investments/daily/TWTR/
```
---
- description: retrieve daily time series data for a multiple stocks (from WTD API)
- request: `GET /api/investments/daily/batch/:tickers/`
- response: 200
  - content-type: `application/json`
  - body: object
    - data : list
      - object:
        - symbol : (string) open price on date open
        - name : (string) high price on day
        - currency : (string) low price on day
        - price: (string) price of stock
        - price_open: (string) price of stock on open
        - day_high: (string) daily high price
        - day_low: (string) daily low price
        - 52_week_high: (string) 52-week high
        - 52_week_low: (string) 52-week low
        - day_change: (string) price change over day
        - change_pct: (string) percentage change day-over-day
        - close_yesterday: (string) close price
        - market_cap: (string) market cap
        - volume: (string) trading volume on day
        - volume_avg: (string) average trading volume over week
        - shares: (string) outstanding shares
        - stock_exchange_long: (string) stock exchange listed on
        - pe: (string) profit to expense ratio
        - eps: (string) earnings per share
- response: 500
  - body: WTD API error

```
$ curl -b tickers.txt -X GET
    localhost:5000/api/investments/daily/batch/TWTR,SNAP,MMM/
```
### Create

- description: add a stock to track for a user
- request: `POST /api/investments/addticker/:username/:ticker/`
- session
- response: 200
  - content-type: `application/json`
  - body: object
    - success: (string) 1 ticker added
- response: 500
  - body: Error adding to DB

```
$ curl -X POST
       -H "Content-Type: `application/json`"
       http://localhost:5000/api/investments/addticker/ram11/TWTR/'
```
---
- description: add number of a certain stock to track for a user
- request: `POST /api/investments/addqty/:username/:ticker/:qty`
- session
- response: 200
  - content-type: `application/json`
  - body: object
    - success: (string) ticker quantity added
- response: 500
  - body: Error adding qty to DB

```
$ curl -X POST
       -H "Content-Type: `application/json`"
       http://localhost:5000/api/investments/addqty/ram11/TWTR/10'
```
---

- description: add buyat price of a certain stock for a user
- request: `POST /api/investments/addbuyat/:username/:ticker/:price`
- session
- response: 200
  - content-type: `application/json`
  - body: object
    - success: (string) ticker buy-at price added
- response: 500
  - body: Error adding buyat price to DB

```
$ curl -X POST
       -H "Content-Type: `application/json`"
       http://localhost:5000/api/investments/ram11/addbuyat/TWTR/189'
```
---

### DELETE
- description: remove tracking of a certain stock for a user
- request: `POST /api/investments/removeticker/:username/:ticker/`
- session
- response: 200
  - content-type: `application/json`
  - body: object
    - success: (string) 1 ticker deleted
- response: 500
  - body: Error deleting

```
$ curl -b cookie.txt -X DELETE
       http://localhost:3003/api/investments/removeticker/testuser/TWTR/
```
