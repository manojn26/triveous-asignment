const db = require("../config/db-confg");

const placeOrder = async (req, res) => {
  try {
    const user_id = req.user_id;

    db.query(
      "SELECT * FROM cart WHERE user_id = ?",
      [user_id],
      (err, success) => {
        if (err) {
          return res.status(400).json(`Error While Fetching Cart Items ${err}`);
        }
        if (!success || success.length <= 0) {
          return res.status(404).json({
            message: "Cart not found. Please add items to your cart first.",
          });
        }

        // Calculate Total Cost

        let price = NaN;

        function calculateTotalSum() {
          let totalAmount = 0;
          for (i = 0; i < success.length; i++) {
            let product = success[i].product_id;
            db.query(
              "SELECT price FROM products WHERE product_id = ?",
              [success[i].product_id],
              (err, suc) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Price" + suc[0].price);
                  let quantity = success.map((val) => {
                    console.log(val);
                    if (val.product_id === product) {
                      console.log("Calculating ", val.quantity * suc[0].price);
                      totalAmount = val.quantity * suc[0].price;
                      createOrder(user_id, totalAmount);
                    }
                  });
                }
              }
            );
          }
        }
        calculateTotalSum();

        // Create New Order
        function createOrder(user_id, total_amounts) {
          db.query(
            "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
            [user_id, total_amounts],

            (err, suc) => {
              if (err) {
                return res
                  .status(400)
                  .json(`Error While Inserting Data Into Orders ${err} `);
              } else {
                db.query(
                  "DELETE FROM cart WHERE user_id = ?",
                  [user_id],
                  (err, s) => {
                    if (err) {
                      res
                        .status(400)
                        .json(`Error While Deleting Cart Data On Orders`);
                    } else {
                      //   console.log(price);
                      res.status(200).json({
                        message: "Order Placed Successfully" + total_amounts,
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      message: "An error occurred while placing the order",
      error: error.message,
    });
  }
};

module.exports = { placeOrder };
