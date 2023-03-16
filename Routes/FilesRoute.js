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
//admin
router
  .route("/files")
  .get(validateToken, checkRole(["Super_Admin", "Admin"]), (req, res) => {
    let users;
    let query =
      "SELECT Id,Email,Firstname,Middlename,Lastname,College,Verified,Gender,Birthday,PhoneNumber FROM buufia.user Where Verified = 1;";

    con.query(query, (err, result) => {
      if (err) throw err;
      users = result;
      res.render("fileUpload", { users: users, errormessage: "" });
    });
  });

router
  .route("/files")
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
      const { title, content } = req.body;
      let users;
      console.log(originalname1);
      //add new file row
      const latestInsertedId = await Insert_A_File_Return_Id(
        `INSERT INTO files (title, content,file_name, file_url, uploaded_by,date) VALUES("${title}","${content}","${originalname1}", "${filename1}", "${res.locals.userID}",NOW());`
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
      let query = "INSERT INTO user_files (file_id,user_id, access) VALUES ?";
      con.query(query, [data], (err, result) => {
        if (err) throw err;
        console.log(result);
      });
      let query2 =
        "SELECT Id,Email,Firstname,Middlename,Lastname,College,Verified,Gender,Birthday,PhoneNumber FROM buufia.user Where Verified = 1;";
      con.query(query2, (err, result) => {
        if (err) throw err;
        users = result;
        res.render("fileUpload", {
          users: users,
          errormessage: "Succesfully Uploaded new file ",
        });
      });
    }
  );

router
  .route("/files")
  .put(validateToken, checkRole(["Super_Admin", "Admin"]), async (req, res) => {
    console.log(req.body);
    const { Selected, file_Id } = req.body;
    const dataToUpdate = Selected.map((user_id, index) => [
      1,
      user_id,
      file_Id,
    ]);
    // Define the update query
    const updateQuery =
      "UPDATE user_files SET access = ?  WHERE user_id = ? AND file_id = ?";

    // Begin the transaction
    con.beginTransaction((err) => {
      if (err) {
        throw err;
      }

      // Iterate over the data to be updated and execute the update query for each record
      dataToUpdate.forEach((data) => {
        con.query(updateQuery, data, (err, result) => {
          if (err) {
            return con.rollback(() => {
              throw err;
            });
          }

          console.log(result.affectedRows + " record(s) updated");
        });
      });
      // Commit the transaction
      con.commit((err) => {
        if (err) {
          return con.rollback(() => {
            throw err;
          });
        }

        console.log("Transaction completed successfully");
      });
    });
    res.redirect(`/access/${file_Id}?status=success`);
  });

router
  .route("/files")
  .delete(
    validateToken,
    checkRole(["Super_Admin", "Admin"]),
    async (req, res) => {
      console.log("delete Route FILE");
    }
  );

router
  .route("/access")
  .get(validateToken, checkRole(["Super_Admin", "Admin"]), async (req, res) => {
    const result = await Return_Result(`SELECT * FROM buufia.files;`);
    res.render("access", { posts: result.reverse() });
  });

router
  .route("/access/:fileId")
  .get(validateToken, checkRole(["Super_Admin", "Admin"]), async (req, res) => {
    let message = "";
    if (req.query.status) {
      message = "Succesfully Updated";
    }
    const user = await Return_Result(
      `SELECT Id,Email,Firstname,Middlename,Lastname,College,Verified,Gender,Birthday,PhoneNumber,access FROM buufia.user_files  INNER JOIN  files on user_files.file_id = files.file_id INNER JOIN  user on user_files.user_id = user.Id where user_files.file_id = ${req.params.fileId} and verified =1;`
    );

    const post = await Return_Result(
      `SELECT * FROM buufia.files where file_id =${req.params.fileId} ;`
    );
    res.render("access_specific", {
      users: user,
      errormessage: message,
      post: post[0],
    });
  });

//all
router
  .route("/List_Files")
  .get(
    validateToken,
    checkRole(["Super_Admin", "Admin", "User"]),
    async (req, res) => {
      const result = await Return_Result(
        `SELECT title,access, user_files.file_id FROM buufia.user_files INNER JOIN user on user.Id = user_files.user_id INNER JOIN files on files.file_id = user_files.file_id where user_id =${res.locals.userID} ;`
      );
      res.render("listFiles", { posts: result });
    }
  );

router
  .route("/List_Files/:fileId")
  .get(
    validateToken,
    checkRole(["Super_Admin", "Admin", "User"]),
    async (req, res) => {
      const access = await Return_Result(
        `SELECT access FROM buufia.user_files where user_id = ${res.locals.userID} and file_id=${req.params.fileId} ;`
      );
      if (access[0].access == 0) {
        res.status(401).render("no_permissions");
      } else {
        console.log(req.params.fileId);
        const result = await Return_Result(
          `SELECT file_id,file_name,file_url,uploaded_by,title,content,FirstName,MiddleName,LastName FROM buufia.files INNER JOIN admin on admin.Id =files.uploaded_by where file_id =${req.params.fileId} ;`
        );
        if (result.length == 0) {
          res.send("error 404");
        } else {
          console.log(result);
          res.render("specificFile", { result: result[0] });
        }
      }
    }
  );

module.exports = router;
