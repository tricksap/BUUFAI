const express = require("express");
require("dotenv").config();

const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const methodOverride = require("method-override");
const port = 3000;

//routes
const UserRoutes = require("./Routes/UserRoutes");
const FileRoutes = require("./Routes/FilesRoute");
const minutesRoutes = require("./Routes/minutesRoutes");
const GeneralAssemblyRoutes = require("./Routes/GeneralAssemblyRoutes");
const CreateAdminRoutes = require("./Routes/createAdminRoutes");
const CreateAnnouncement = require("./Routes/Announcement");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

const upload = multer({ storage: storage });
const app = express();

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

const {
  generateAccessToken,
  validateToken,
  checkRole,
} = require("./Helper/JWT");
const { compareArrays } = require("./Helper/ArrayCompare");
const { Insert_A_File_Return_Id, Return_Result } = require("./Helper/SQLQuery");

app.use(express.static("public/"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", ["./views/admin", "./views/client", "./views/partials"]);

global.con = mysql.createConnection({
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
    position,

    designation,
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
    designation: designation,
    position: position,
    Role: "User",
  };
  con.query(query, data, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.render("AfterRegister");
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

app.get("/HomeDashboard", validateToken, async (req, res) => {
  const announcements = await Return_Result(`SELECT * FROM announcements;`);
  res.render("Dashboard_Client", { announcements: announcements.reverse() });
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

      res.redirect("/homeDashboard");
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

app.get("/profile", validateToken, (req, res) => {
  console.log(res.locals.userID);
  res.render("Profile", { errormessage: "" });
});

app.get("/public/:filename", validateToken, (req, res) => {
  const filePath = __dirname + "/public/uploads/" + req.params.filename;
  res.sendFile(filePath);
});

app.get("/cert", validateToken, async (req, res) => {
  const result = await Return_Result(
    `SELECT Firstname,Lastname FROM buufia.user where id = ${res.locals.userID}`
  );
  console.log(result[0].Lastname);

  const url = cloudinary.url("5819472-01_hxyono", {
    transformation: [
      {
        overlay: {
          font_family: "Montserrat",
          font_size: 100,
          font_weight: "bold",
          text: result[0].Firstname + " " + result[0].Lastname,
        },
        color: "#14b1ab",
        effect: "colorize",
        y: "-50",
        width: "0.45",
        flags: "relative",
      },
    ],
  });
  console.log(url);
});

app.get("/logout", (req, res) => {
  // clear the cookie with the name "my_cookie"
  res.clearCookie("jwt");
  res.redirect("/");
});

app.use(UserRoutes);
app.use(FileRoutes);
app.use(minutesRoutes);
app.use(GeneralAssemblyRoutes);
app.use(CreateAdminRoutes);
app.use(CreateAnnouncement);
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
