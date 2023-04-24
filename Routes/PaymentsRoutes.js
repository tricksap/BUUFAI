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
const { count } = require("console");

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
  .route("/payments")
  .get(validateToken, checkRole(["Super_Admin", "Admin"]), async (req, res) => {
    console.log("aaaaa");
    const month = req.query.month || new Date().getMonth() + 1; // default to current month
    const year = req.query.year || new Date().getFullYear();
    const currentYear = new Date().getFullYear();
    console.log(req.query);
    console.log(
      `SELECT Email,paid,created_at,Firstname,Middlename,Lastname FROM user LEFT JOIN monthly_payments ON user.Id = monthly_payments.user_id and month = ${month} and year = ${year} where verified = 1;`
    );
    const users = await Return_Result(
      `SELECT Email,paid,created_at,Firstname,Middlename,Lastname FROM user LEFT JOIN monthly_payments ON user.Id = monthly_payments.user_id and month = ${month} and year = ${year} where verified = 1;`
    );
    res.render("Payments", {
      users: users,
      currentYear: currentYear,
      query: req.query,
    });
  });

router
  .route("/Newpayments")
  .get(validateToken, checkRole(["Super_Admin", "Admin"]), async (req, res) => {
    const users = await Return_Result(
      `SELECT Id,Firstname,Middlename,Lastname FROM buufia.user Where Verified = 1;`
    );
    const userPayments = {
      userId: 6,
      payments: [],
    };

    if (req.query.user) {
      const last_payment_date = await Return_Result(
        `SELECT * FROM monthly_payments WHERE user_id = ${req.query.user}`
      );

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Initialize the `payments` array with all months marked as unpaid
      for (let i = 1; i <= 12; i++) {
        userPayments.payments.push({
          month: i,
          year: 2023,
          status: "unpaid",
          monthName: monthNames[i - 1],
        });
      }

      // Assume that `rows` is the array of rows retrieved from the MySQL query

      last_payment_date.forEach((row) => {
        const month = parseInt(row.month);
        console.log(row.month);
        const year = parseInt(row.year);
        const paymentIndex = userPayments.payments.findIndex((payment) => {
          return payment.month === month && payment.year === year;
        });
        if (paymentIndex !== -1) {
          userPayments.payments[paymentIndex].status = "paid";
          userPayments.payments[paymentIndex].date = row.created_at;
        }
      });
    }

    console.log(userPayments);
    res.render("NewPayment", {
      errormessage: "",
      users: users,
      query: req.query,
      userPayments: userPayments,
    });
  });

router
  .route("/Newpayments")
  .post(
    validateToken,
    checkRole(["Super_Admin", "Admin"]),
    async (req, res) => {
      let { user, month, num_months, amount } = req.body;
      let amountInt = parseInt(amount);
      for (let i = 0; i < num_months; i++) {
        month = parseInt(month, 10);
        const created = await Return_Result(
          `INSERT INTO buufia.monthly_payments (user_id, month, year, paid, created_at) VALUES ("${user}", "${month}", YEAR(CURDATE()), ${amountInt}, NOW());`
        );
        month += 1;
        console.log(created);
      }
      res.redirect(req.get("referer"));
    }
  );

module.exports = router;
