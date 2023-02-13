const express = require("express");
const { validateToken, checkRole } = require("../Helper/JWT");
const router = express.Router();
const multer = require("multer");
const { Return_Result } = require("../Helper/SQLQuery");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
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
module.exports = router;
router
  .route("/files")
  .post(
    validateToken,
    checkRole(["Super_Admin", "Admin"]),
    upload.single("file"),
    async (req, res) => {
      const { originalname, filename } = req.file;
      const { title, content } = req.body;

      let users;

      //add new file row
      const latestInsertedId = await Insert_A_File_Return_Id(
        `INSERT INTO files (title, content,file_name, file_url, uploaded_by) VALUES("${title}","${content}","${originalname}", "${filename}", "${res.locals.userID}");`
      );
      let userId = await Return_Result("SELECT Id FROM buufia.user;");
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
  .route("/access")
  .get(validateToken, checkRole(["Super_Admin", "Admin"]), async (req, res) => {
    const result = await Return_Result(`SELECT * FROM buufia.files;`);
    res.render("access", { posts: result });
  });

router
  .route("/access/:file_id")
  .get(validateToken, checkRole(["Super_Admin", "Admin"]), async (req, res) => {
    console.log(req.params.file_id);
    // const result = await Return_Result(`SELECT * FROM buufia.files;`);
    // res.render("access_specific", { posts: result });
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
      console.log(req.params.fileId);
      const result = await Return_Result(
        `SELECT * FROM buufia.files where file_id =${req.params.fileId} ;`
      );
      if (result.length == 0) {
        res.send("error 404");
      } else {
        console.log(result);
        res.render("specificFile", { result: result[0] });
      }
    }
  );

module.exports = router;
