const Insert_A_File_Return_Id = (sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows.insertId);
    });
  });
};

const Return_Result = (sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, rows) => {
      if (err) {
        return reject(err);
      }

      return resolve(rows);
    });
  });
};

module.exports = { Insert_A_File_Return_Id, Return_Result };
