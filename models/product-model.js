const db = require("../config/db-confg");

const createProductTable = () => {
  db.query(
    "CREATE TABLE IF NOT EXISTS products (product_id INT AUTO_INCREMENT PRIMARY KEY,product_name VARCHAR(255),category VARCHAR(255),price INT,description VARCHAR(1024),image VARCHAR(255),availability BOOLEAN,quantity INT,user_id INT,FOREIGN KEY (user_id) REFERENCES users(regitser_user_id))",
    (err, res) => {
      if (err) {
        console.log(`ERROR WHILE CREATING PRODUCT TABLE : ${err}`);
      } else {
        console.log(`PRODUCT TABLE CREATED SUCCESFULLY`);
      }
    }
  );
};

module.exports = createProductTable;
