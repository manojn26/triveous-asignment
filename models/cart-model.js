const db = require("../config/db-confg");

const createCartTable = () =>
  db.query(
    "CREATE TABLE IF NOT EXISTS cart (cart_id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, product_id INT, quantity INT, FOREIGN KEY (user_id) REFERENCES users(regitser_user_id), FOREIGN KEY (product_id) REFERENCES products(product_id))",
    (err, res) => {
      if (err) {
        console.log(`ERROR WHILE CREATING CART TABLE ${err}`);
      } else {
        console.log(`CART TABLE CREATED SUCCESSFULLY`);
      }
    }
  );

module.exports = createCartTable;
