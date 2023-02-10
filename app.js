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
app.use(cookieParser());

const {
  generateAccessToken,
  validateToken,
  checkRole,
} = require("./Helper/JWT");

app.use(express.static("public/"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", ["./views/admin", "./views/client", "./views/partials"]);

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
    res.render("AfterRegister");
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

app.get(
  "/dashboard",
  validateToken,
  checkRole(["Super_Admin", "Admin"]),

  (req, res) => {
    res.render("Dashboard");
  }
);

app.get("/HomeDashboard", validateToken, (req, res) => {
  res.render("Dashboard_Client");
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

app.get("/loginAdmin", (req, res) => {
  res.render("Login_Admin", { errormessage: "" });
});

app.post("/loginAdmin", (req, res) => {
  let query = "SELECT * FROM buufia.admin Where	Email =? and Password = ?";
  let data = [req.body.email, req.body.password];
  con.query(query, data, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.render("Login", { errormessage: "Account Does Not Exist" });
    } else {
      console.log(result);
      let token = generateAccessToken({
        id: result[0].Id,
        role: result[0].Role,
      });
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });

      res.redirect("/dashboard");
    }
  });
});

app.get(
  "/unverifiedUser",
  validateToken,
  checkRole(["Super_Admin"]),
  (req, res) => {
    console.log(res.locals.sample);
    let users;
    let query =
      "SELECT Id,Email,Firstname,Middlename,Lastname,College,Verified,Gender,Birthday,PhoneNumber FROM buufia.user Where Verified = 0;";

    con.query(query, (err, result) => {
      if (err) throw err;
      users = result;
      res.render("Unverified", { users });
    });
  }
);

app.get("/Users", validateToken, checkRole(["Super_Admin"]), (req, res) => {
  console.log(res.locals.sample);
  let users;
  let query =
    "SELECT Id,Email,Firstname,Middlename,Lastname,College,Verified,Gender,Birthday,PhoneNumber FROM buufia.user";

  con.query(query, (err, result) => {
    if (err) throw err;
    users = result;
    res.render("Unverified", { users });
  });
});

app.get("/profile", validateToken, (req, res) => {
  console.log(res.locals.userID);
  res.render("Profile", { errormessage: "" });
});

app.get("/files", validateToken, (req, res) => {
  res.render("fileUpload", { errormessage: "" });
});

app.post("/sample", (req, res) => {
  console.log(req.body);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
