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
  .route("/GeneralAssembly")
  .get(validateToken, checkRole(["Super_Admin", "Admin"]), (req, res) => {
    let users;
    let query =
      "SELECT user.Id,Firstname,Middlename,Lastname,College,Position,Designation, MAX(general_assembly.date) AS last_attendance_date FROM user LEFT JOIN user_attendance ON user.id = user_attendance.user_id LEFT JOIN general_assembly ON user_attendance.general_assembly_id = general_assembly.id Where verified = 1 GROUP BY user.id;";

    con.query(query, (err, result) => {
      if (err) throw err;
      users = result;
      res.render("NewGeneralAssembly", { users: users, errormessage: "" });
    });
  });

router
  .route("/GeneralAssembly")
  .post(
    validateToken,
    checkRole(["Super_Admin", "Admin"]),
    upload.single("file"),
    async (req, res) => {
      const { title, DateTime, location, content } = req.body;

      //add new file row
      const latestInsertedId = await Insert_A_File_Return_Id(
        `INSERT INTO buufia.general_assembly (title, location, date, created_at, minutes) VALUES ('${title}', '${location}', '${DateTime}', NOW(), '${content}');`
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
      data = data
        .filter((innerArr) => innerArr[2] !== false)
        .map((innerArr) => [innerArr[0], innerArr[1]]);

      let query =
        "INSERT INTO buufia.user_attendance(general_assembly_id,user_id) VALUES ?";

      con.query(query, [data], (err, result) => {
        if (err) throw err;
        console.log(result);
      });

      let query2 =
        "SELECT user.Id,Firstname,Middlename,Lastname,College,Position,Designation, MAX(general_assembly.date) AS last_attendance_date FROM user LEFT JOIN user_attendance ON user.id = user_attendance.user_id LEFT JOIN general_assembly ON user_attendance.general_assembly_id = general_assembly.id Where verified = 1 GROUP BY user.id;";

      con.query(query2, (err, result) => {
        if (err) throw err;
        users = result;
        res.render("NewGeneralAssembly", {
          users: users,
          errormessage: "Created New General Assembly",
        });
      });
    }
  );

//all

router
  .route("/List_GeneralAssembly")
  .get(
    validateToken,
    checkRole(["Super_Admin", "Admin", "User"]),
    async (req, res) => {
      const result = await Return_Result(
        `SELECT * FROM buufia.user_attendance Inner Join general_assembly on user_attendance.general_assembly_id = general_assembly.id where user_id = ${res.locals.userID} ;`
      );
      const lastAttendance = await Return_Result(
        `SELECT user.Id,Firstname,Middlename,Lastname,College,Position,Designation, MAX(general_assembly.date) AS last_attendance_date FROM user LEFT JOIN user_attendance ON user.id = user_attendance.user_id LEFT JOIN general_assembly ON user_attendance.general_assembly_id = general_assembly.id Where user.Id = ${res.locals.userID}`
      );
      console.log(lastAttendance[0].last_attendance_date);

      res.render("List_GeneralAssembly", {
        posts: result,
        lastAttendance: lastAttendance[0],
      });
    }
  );

module.exports = router;
