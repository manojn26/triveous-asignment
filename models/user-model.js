const db = require("../config/db-confg");

const createUserRegisterTable = () =>
  db.query(
    "CREATE TABLE IF NOT EXISTS users (regitser_user_id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255), password VARCHAR(255))",
    (err, res) => {
      if (err) {
        console.log(`ERROR WHILE CREATING REGISTER TABLE DATABASE : ${err}`);
      } else {
        console.log(`REGISTER USERS TABLE CREATED SUCCESSFULLY`);
      }
    }
  );

module.exports = createUserRegisterTable;
