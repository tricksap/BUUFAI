const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const port = 3000;

const app = express();

app.use(express.static("public/"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
  let q = "INSERT INTO user SET ?";
  let d = {
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
  console.log(q);
  con.query(q, d, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("asd");
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

app.get("/unverifiedUser", (req, res) => {
  res.sendFile(__dirname + "/views/admin/Unverified.html");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
