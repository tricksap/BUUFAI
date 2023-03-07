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
  .route("/NewAnnouncement")
  .get(validateToken, checkRole(["Super_Admin", "Admin"]), (req, res) => {
    res.render("NewAnnouncement", { errormessage: "" });
  });

router
  .route("/NewAnnouncement")
  .post(
    validateToken,
    upload.single("file"),
    checkRole(["Super_Admin", "Admin"]),
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
      const latestInsertedId = await Insert_A_File_Return_Id(
        `INSERT INTO announcements (title, content, created_at, admin_id, file_url) VALUES ("${title}", "${content}", NOW(), "${res.locals.userID}",  "${filename1}");`
      );

      res.render("NewAnnouncement", { errormessage: "Added New Announcement" });
    }
  );

router
  .route("/Announcement/:id")
  .get(
    validateToken,
    checkRole(["Super_Admin", "Admin", "User"]),
    async (req, res) => {
      const result = await Return_Result(
        `SELECT * FROM announcements where id =${req.params.id}`
      );
      const comment = await Return_Result(
        `SELECT Firstname,Lastname,College, comment_id,announcement_id,user_id,comment,created_at FROM buufia.announcement_comment INNER JOIN user on user.Id = announcement_comment.user_id where announcement_id =${req.params.id}`
      );
      res.render("specificAnnouncement", {
        result: result[0],
        comment: comment,
      });
    }
  );

router.route("/comment").post(validateToken, async (req, res) => {
  const { comment, announcementId } = req.body;
  console.log(
    `INSERT INTO announcement_comment (announcement_id, user_id, comment, created_at) VALUES ("${announcementId}", "${res.locals.userID}", "${comment}", NOW());`
  );
  const result = await Return_Result(
    `INSERT INTO announcement_comment (announcement_id, user_id, comment, created_at) VALUES ("${announcementId}", "${res.locals.userID}", "${comment}", NOW());`
  );
  res.redirect(req.get("referer"));
});

module.exports = router;
