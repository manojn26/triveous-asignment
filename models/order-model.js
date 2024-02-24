const db = require("../config/db-confg");

const createOrderTable = () => {
  db.query(
    "CREATE TABLE IF NOT EXISTS orders (id INT AUTO_INCREMENT PRIMARY KEY,user_id INT, total_amount INT,status VARCHAR(255),order_at DATE DEFAULT CURRENT_DATE,FOREIGN KEY (user_id) REFERENCES users(regitser_user_id))",
    (err, success) => {
      if (err) {
        console.log(`ERROR WHILE CREATING ORDER TABLE : ${err}`);
      } else {
        console.log(`ORDER TABLE CREATED SUCCESSFULLY`);
      }
    }
  );
};

module.exports = createOrderTable;
