# FinTrack REST API Documentation

## Signup / Signin

- description: Sign up a new user
- request: `POST /signup/`
  - content-type: `application/json`
  - body: object
    - username: (string) unique username
    - email: email for user (must be unique)
    - password: (string) password for user
- response: 200
  - content-type: `application/json`
  - body: (string) username that was created

```
$ curl -X POST
       -H "Content-Type: `application/json`"
       -d '{"username":"me","password":"pass"}
       http://localhost:3000/signup/'
```

- description: Sign in as existing user
- request: `POST /signin/`
  - content-type: `application/json`
  - body: object
    - username: (string) unique username
    - password: (string) password for user
- response: 200
  - content-type: `application/json`
  - body: (string) username that signed in

```
$ curl -X POST
       -H "Content-Type: `application/json`"
       -d '{"username":"me","password":"pass"}
       -c cookie.txt
       http://localhost:3000/signin/'
```

- description: Sign out of session (destory session)
- request: `POST /signout/`
- response: 200

```
$ curl -X POST
       -c cookie.txt
       http://localhost:3000/signout/'
```

---

- description: Enter/update salary information
- request: `PATCH /userProfile/salary`
  - content-type: `application/json`
  - body: object
    - salary: (float) income per month
- response: 200

---

- description: Change primary email address
- request: `PATCH /userProfile/email`
  - content-type: `application/json`
  - body: object
    - email: (string) unique email to replace one from set up
- response: 200

---

- description: Change user password
- request: `PATCH /userProfile/password`
  - content-type: `application/json`
  - body: object
    - password: (string) new Password must be different from old
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
    - type: (string) the type of expense
    - amount: (float) the amount of the expense
    - date: (date) date
    - payment_type: (cash|credit|debit)
    - description: (string) description
- response: 200
  - content-type: `application/json`
  - body: object
    - \_id: (string) the expenses id
    - type: (string) the type of expense
    - amount: (float) the amount of the expense
    - date: (date) date
    - payment_type: (cash|credit|debit)
    - description: (string) description

---

### Get Expense

- description: retrieve the expenses that is stored
- request: `GET /api/expense/:id/`
- response: 200
  - content-type: `application/json`
  - body: object
    - \_id: (string) the expenses id
    - type: (string) the type of expense
    - amount: (float) the amount of the expense
    - date: (date) date
    - payment_type: (cash|credit|debit)
    - description: (string) description
- response: 404
  - body: expenses id does not exists

---

- description: retrieve the expenses from page\*limit to page\*limit +1
- request: `GET /api/expenses/`
  - content-type: `application/json
  - body: object
    - page: (int) the type of expense
    - limit: (int) the amount of the expense
    - type: (string)[optional] Get expenses that are of this type (if this is null ignore)
    - payment_type: (string)[optional] Get expenses that of of this type (if null ignore)
- response: 200
  - content-type: `application/json`
  - body: list
    - \_id: (string) the expenses id
    - type: (string) the type of expense
    - amount: (float) the amount of the expense
    - date: (date) date
    - payment_type: (cash|credit|debit)
    - description: (string) description

---

- description: retrieve the expenses from page\*limit to page\*limit +1 in the month, month
- request: `GET /api/expenses/:month`
  - content-type: `application/json
  - body: object
    - page: (int) the type of expense
    - limit: (int) the amount of the expense
    - type: (string)[optional] Get expenses that are of this type (if this is null ignore)
    - payment_type: (string)[optional] Get expenses that of of this type (if null ignore)
- response: 200
  - content-type: `application/json`
  - body: list
    - \_id: (string) the expenses id
    - type: (string) the type of expense
    - amount: (float) the amount of the expense
    - date: (date) date
    - payment_type: (cash|credit|debit)
    - description: (string) description

---

### Delete

- description: delete the expenses id and all assosiated comments
- request: `DELETE /api/expenses/:id/`
- response: 200
  - content-type: `application/json`
  - body: object
    - \_id: (string) the expenses id
    - type: (string) the type of expense
    - amount: (float) the amount of the expense
    - date: (date) date
    - payment_type: (cash|credit|debit)
    - description: (string) description
- response: 404
  - body: expenses :id does not exists

```
$ curl -b cookie.txt -X DELETE
       http://localhost:3000/api/messages/jed5672jd90xg4awo789/
```