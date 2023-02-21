const express = require("express");
const { validateToken, checkRole } = require("../Helper/JWT");
const router = express.Router();

const multer = require("multer");
const {
  Return_Result,
  Insert_A_File_Return_Id,
} = require("../Helper/SQLQuery");
const mysql = require("mysql2");
const path = require("path");
const { compareArrays } = require("../Helper/ArrayCompare");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    if (!file) {
      cb(null, "");
    } else {
      cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    }
  },
});

const upload = multer({ storage: storage });

router
  .route("/minutes")
  .get(validateToken, checkRole(["Super_Admin", "Admin"]), (req, res) => {
    let users;
    let query =
      "SELECT Id,Email,Firstname,Middlename,Lastname,College,Verified,Gender,Birthday,PhoneNumber FROM buufia.user Where Verified = 1;";

    con.query(query, (err, result) => {
      if (err) throw err;
      users = result;
      res.render("Meetingminutes", { users: users, errormessage: "" });
    });
  });

router
  .route("/minutes")
  .post(
    validateToken,
    checkRole(["Super_Admin", "Admin"]),
    upload.single("file"),
    async (req, res) => {
      let originalname1;
      let filename1;
      if (!req.file) {
        originalname1 = "";
        filename1 = "";
      } else {
        const { originalname, filename } = req.file;
        originalname1 = originalname;
        filename1 = filename;
      }
      const { title, content, DateTime } = req.body;

      //add new file row
      const latestInsertedId = await Insert_A_File_Return_Id(
        `INSERT INTO buufia.meeting_minutes (meeting_date, minutes, uploaded_by, title, file_name, file_url) VALUES ("${DateTime}", "${content}", "${res.locals.userID}", "${title}", "${originalname1}", "${filename1}");`
      );
      let userId = await Return_Result(
        "SELECT Id FROM buufia.user where verified = 1;"
      );
      userId = userId.map(function (obj) {
        return obj.Id;
      });
      //convert string to number
      let selected = req.body.Selected.map(Number);
      //comapre the array that contains the user that can access and the array of all users
      let data = compareArrays(latestInsertedId, selected, userId);
      //bulk input the user to the table
      let query =
        "INSERT INTO buufia.user_meeting_minutes(meeting_id,user_id,access ) VALUES ?";

      con.query(query, [data], (err, result) => {
        if (err) throw err;
        console.log(result);
      });
      let query2 =
        "SELECT Id,Email,Firstname,Middlename,Lastname,College,Verified,Gender,Birthday,PhoneNumber FROM buufia.user Where Verified = 1;";
      ("");
      con.query(query2, (err, result) => {
        if (err) throw err;
        users = result;
        res.render("Meetingminutes", {
          users: users,
          errormessage: "Succesfully Uploaded New Minutes ",
        });
      });
    }
  );

//cleint alll
router
  .route("/List_Minutes")
  .get(
    validateToken,
    checkRole(["Super_Admin", "Admin", "User"]),
    async (req, res) => {
      const result = await Return_Result(
        `SELECT title,access,meeting_minutes.meeting_id,meeting_minutes.meeting_date FROM buufia.user_meeting_minutes INNER JOIN  user on user.Id = user_meeting_minutes.user_id INNER JOIN meeting_minutes on user_meeting_minutes.meeting_id = meeting_minutes.meeting_id where user_id = ${res.locals.userID} ;`
      );
      res.render("listMinutes", { posts: result });
    }
  );

router
  .route("/List_Minutes/:meetingId")
  .get(
    validateToken,
    checkRole(["Super_Admin", "Admin", "User"]),
    async (req, res) => {
      console.log(req.params.meetingId);
      const result = await Return_Result(
        `SELECT * FROM buufia.meeting_minutes where meeting_id =${req.params.meetingId} ;`
      );

      const user = await Return_Result(
        `SELECT Firstname, Middlename, Lastname, College,Designation,Position FROM buufia.user_meeting_minutes
        INNER JOIN  user on user.Id = user_meeting_minutes.user_id
        where meeting_id=${req.params.meetingId} ;`
      );

      if (result.length == 0) {
        res.send("error 404");
      } else {
        console.log(result);
        res.render("specificMinutes", { result: result[0], users: user });
      }
    }
  );

module.exports = router;
