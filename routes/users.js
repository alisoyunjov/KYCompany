const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cookie = require("cookie");
const nodemailer = require('nodemailer');


const {
  add_user,
  user_signin,
  get_users,
  find_user_by_email,

} = require("../dataAccess/usersData");

const {
  applyValidationRules,
  validate
} = require("../utilities/inputValidator");

const isAuthenticated = function(req, res, next) {
    if (!req.session.username) return res.status(401).end("access denied");
    next();
};


const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//basic QA checkup
router.get("/", async function(req, res) {
  console.log("path /api/user/");

  res.status(200).send("/api/user/ in users controller");
});


//Signup

router.post(
    "/signup",
    applyValidationRules("/signup"),
    validate,
    async function(req, res) {
        console.log("path /api/user/signup/");
        let name = req.body.name;
        let surname = req.body.surname;
        let role = req.body.role;
        let password = req.body.password;
        let email = req.body.email;
        const exists_in_user_db = await find_user_by_email(email);

        if (exists_in_user_db) {
            return res
                .status(409)
                .json({ error: "User with this email already exists" });
        }
        let salt = crypto.randomBytes(16).toString("base64");
        let hash = crypto.createHmac("sha512", salt);
        hash.update(password);
        let saltedHash = hash.digest("base64");
        password = saltedHash;

        const result = await add_user(name, surname, email, role, password, salt);

        if (result) {
            req.session.username = email;
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("username", email, {
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7
                })
            );
            return res
                .status(200)
                .json({ success: "user with email: " + email + " signed up" });
        }
        return res.status(500).json({ error: "Internal server error" });

    }
);

//Signin

router.post(
    "/signin",
    applyValidationRules("/signin"),
    validate,
    async function(req, res) {
        console.log("path /api/user/signin/");
        var email = req.body.email;
        var password = req.body.password;
        // retrieve user from the database
        const user = await find_user_by_email(email);
        if (!user) {
            return res
                .status(409)
                .json({ error: "User with this username does not exist" });
        }
        let salt = user.salt;
        var hash = crypto.createHmac("sha512", salt);
        hash.update(password);
        var saltedHash = hash.digest("base64");
        password = saltedHash;
        console.log(password, salt);
        console.log(user.password);


        if (user.password !== password)
            return res.status(401).json({ error: "access denied" });
        // initialize cookie
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("username", email, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7
            })
        );
        //session
        req.session.username = email;
        return res.json({ success: "user " + email + " signed in" });
    }
);

router.get("/isauthenticated", function(req, res) {
  if (req.session.username)
    return res.json({ isauth: true, username: req.session.username });
  return res.json({ isauth: false, username: null });
});

router.post("/signout", function(req, res) {
  console.log("path /api/user/signout/");
  req.session.destroy();
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("username", "", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    })
  );
  res.status(200).json({ success: "Signed out" });
});

//Update email of a user
router.patch(
  "/profile/email", isAuthenticated,
  applyValidationRules("/profile/email"),
  validate,
  async function(req, res) {
    console.log("path /api/user/profile/email");
    const result = await update_email(req.body.username, req.body.email);
    if (result && result.modifiedCount) {
      return res
        .status(200)
        .json({
          message: `Updated the email of the user ${req.body.username}`
        });
    }
    return res.status(404).json({
      error: "User with the given username not found or the email is the same"
    });
  }
);
//Update password of a user
router.patch("/profile/password",
    isAuthenticated,
    applyValidationRules("/profile/password"),
    validate,
    async function(req, res) {
  console.log("path /api/user/profile/password");
  //check old password
    const username = req.body.username;
    let old_password = req.body.old_password;
    const user = await find_user_by_username(username);
    if (!user) {
        return res
            .status(409)
            .json({ error: "User with this username does not exist" });
    }
    let salt = user.salt;
    let old_hash = crypto.createHmac("sha512", salt);
    old_hash.update(old_password);
    let saltedHash = old_hash.digest("base64");
    old_password = saltedHash;
    if (user.password !== old_password)
        return res.status(401).json({ error: " old passwords don't patch" });
    let new_password = req.body.new_password;
    let new_salt = crypto.randomBytes(16).toString("base64");
    let new_hash = crypto.createHmac("sha512", new_salt);
    new_hash.update(new_password);
    let new_saltedHash = new_hash.digest("base64");
    new_password = new_saltedHash;
    const result = await update_password(req.body.username, new_password, new_salt);
    if (result && result.modifiedCount) {
        return res
          .status(200)
          .json({ message: `Updated the password of the user ${req.body.username}` });
  }
  return res.status(404).json({
    error: "User with the given username not found or the new password is the same as the old one."
  });
});

//get user info by username

router.get('/info/:user_email', async function(req, res){
    let result = await find_user_by_email(req.params.user_email);
    if(result){
        delete result._id; delete result.password; delete result.salt; delete result.tickers;
        return res.status(200).json(result);
    }
    return res.status(404).json({
        error: "User with the given email not found."
    });
});

//export the router
module.exports = router;
