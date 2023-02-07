const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const port = 3000;

const app = express();

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json());

const { generateAccessToken } = require("./Helper/JWT");

app.use(express.static("public/"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", ["./views/admin", "./views/client"]);

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "buufia",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to database");
});

app.post("/", (req, res) => {
  console.log(req.body);
  const {
    email,
    firstname,
    middlename,
    lastname,
    college,
    password,
    gender,
    birthday,
    phoneNumber,
  } = req.body;
  let query = "INSERT INTO user SET ?";
  let data = {
    email: email,
    firstname: firstname,
    middlename: middlename,
    lastname: lastname,
    college: college,
    password: password,
    gender: gender,
    birthday: birthday,
    phoneNumber: phoneNumber,
  };
  con.query(query, data, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("asd");
  });
});
app.post("/verifyUser", (req, res) => {
  console.log(req.body);
  let query = `UPDATE buufia.user SET Verified = '1' WHERE (Id = ${req.body.id});`;
  con.query(query, (err, result) => {
    if (err) throw err;
    users = result;
    res.redirect("/unverifiedUser");
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/client/BUUFAI.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/views/client/Registration.html");
});

app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/views/admin/Dashboard.html");
});

app.get("/login", (req, res) => {
  res.render("Login", { errormessage: "" });
});

app.post("/login", (req, res) => {
  let query = "SELECT * FROM buufia.user Where	Email =? and Password = ?";
  let data = [req.body.email, req.body.password];
  con.query(query, data, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.render("Login", { errormessage: "Account Does Not Exist" });
    } else if (result[0].Verified === 0) {
      res.render("Login", {
        errormessage: "Account is not yet Verified by the Admin",
      });
    } else {
      let token = generateAccessToken({
        id: result[0].Id,
        role: result[0].Role,
      });
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });

      res.render("Dashboard_Client");
    }
  });
});

app.get("/unverifiedUser", (req, res) => {
  let users;
  let query =
    "SELECT Id,Email,Firstname,Middlename,Lastname,College,Verified,Gender,Birthday,PhoneNumber FROM buufia.user Where Verified = 0;";

  con.query(query, (err, result) => {
    if (err) throw err;
    users = result;
    res.render("Unverified", { users });
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
