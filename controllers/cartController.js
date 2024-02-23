const db = require("../config/db-confg");
const { validationResult } = require("express-validator");
const decrementProductQuantity = require("./productController");

// Function to add a product to the cart and also incrementing quantity of products in cart
const addToCart = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user_id = req.user_id;
    let { product, quantity } = req.body;
    if (!quantity) {
      quantity = 1;
    }
    // Check if the user has an existing cart, or create a new one if not
    db.query(
      "SELECT * FROM cart WHERE user_id = ?",
      [user_id],
      (err, success) => {
        if (err) {
          return res.status(400).json(`Error while fetching cart for user id`);
        } else {
          if (success.length === 0) {
            db.query(
              "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
              [user_id, product, quantity],
              (err, succ) => {
                if (err) {
                  return res
                    .status(400)
                    .json(`Error While Inserting to Cart Table ${err}`);
                } else {
                  return res.status(200).json("Item Added to  Cart");
                }
              }
            );
          } else {
            db.query(
              "SELECT * FROM cart WHERE product_id = ?",
              [product],
              (err, succ) => {
                if (err) {
                  return res
                    .status(400)
                    .json(`Error While Search products from Cart : ${err}`);
                } else {
                  if (succ.length >= 1) {
                    let currentQuantity = succ[0].quantity + 1;

                    db.query(
                      "UPDATE cart SET quantity = ? WHERE product_id = ?",
                      [currentQuantity, product],
                      (err, su) => {
                        if (err) {
                          return res
                            .status(400)
                            .json(
                              `Errow While Updating Cart Already In Product`
                            );
                        } else {
                          return res.status(200).json("Cart Updated");
                        }
                      }
                    );
                  } else {
                    db.query(
                      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
                      [user_id, product, quantity],
                      (err, su) => {
                        if (err) {
                          return res
                            .status(400)
                            .json(
                              `Error While Insertng To Cart New Items ${err}`
                            );
                        } else {
                          return res.json({
                            message: "Product added to the cart successfully",
                          });
                        }
                      }
                    );
                  }
                }
              }
            );
          }
        }
      }
    );
  } catch (error) {
    console.error("Error adding product to the cart:", error);
    res.status(500).json({
      message: "An error occurred while adding the product to the cart",
      error: error.message,
    });
  }
};

const viewCart = async (req, res) => {
  try {
    const user_id = req.user_id;

    db.query(
      "SELECT product_id FROM cart WHERE user_id = ?",
      [user_id],
      (err, success) => {
        if (err) {
          return res
            .status(400)
            .json(
              "There is some Error While Searching the ProductId From Cart Database"
            );
        } else {
          let product_id = [];

          for (i = 0; i < success.length; i++) {
            product_id.push(success[i].product_id);
          }

          const placeholders = product_id.map(() => "?").join(", ");

          const sqlQuery = `
          SELECT
              products.*
          FROM
              cart
          INNER JOIN
              users ON cart.user_id = users.regitser_user_id
          INNER JOIN
              products ON cart.product_id = products.product_id
          WHERE
              users.regitser_user_id = ?
          AND
              products.product_id IN (${placeholders});
        `;
          const params = [user_id, ...product_id];
          db.query(sqlQuery, params, (err, succ) => {
            if (err) {
              return res
                .status(400)
                .json(
                  "There is Some Issue While Fetching Products For the User " +
                    err
                );
            } else {
              return res.status(200).json(succ);
            }
          });
        }
      }
    );
  } catch (error) {
    console.error("Error retrieving cart details:", error);
    res.status(500).json({
      message: "An error occurred while retrieving cart details",
      error: error.message,
    });
  }
};

// Function to decrement the quantity of a product in the cart

const decrementQuantity = async (req, res) => {
  // Validating the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user_id;
    const productId = req.params.productId;

    // Find the Users Cart
    db.query(
      "SELECT * FROM cart WHERE user_id = ?",
      [userId],
      (err, success) => {
        if (err) {
          return res
            .status(400)
            .json(`Error While Fetching Cart For Decrementing Quantity ${err}`);
        } else {
          if (success.length === 0) {
            return res.status(404).json({ message: "Cart not found" });
          }
          const sqlQuery = `
          SELECT
              cart.*
          FROM
              cart
          INNER JOIN
              users ON cart.user_id = users.regitser_user_id
          INNER JOIN
              products ON cart.product_id = products.product_id
          WHERE
              users.regitser_user_id = ?
          AND
              products.product_id = ?;
        `;

          db.query(sqlQuery, [userId, productId], (err, succ) => {
            if (err) {
              return res.status(400).json(`Error While Joining Tables ${err}`);
            } else {
              if (succ[0].quantity > 0) {
                console.log(succ);
                let currentQuantity = succ[0].quantity;
                console.log(currentQuantity);
                currentQuantity -= 1;
                console.log(currentQuantity);
                db.query(
                  "UPDATE cart SET quantity = ? WHERE product_id = ?",
                  [currentQuantity, productId],
                  (err, s) => {
                    if (err) {
                      return res
                        .status(400)
                        .json(`Error While Updating the Quantity ${err}`);
                    } else {
                      res.json({
                        message: "Quantity decremented successfully",
                        s,
                      });
                    }
                  }
                );
              }

              if (succ[0].quantity === 0) {
                db.query(
                  "DELETE FROM cart WHERE product_id = ?",
                  [productId],
                  (err, s) => {
                    if (err) {
                      return res
                        .status(400)
                        .json(`Error While Deleting the Cart`);
                    } else {
                      res.json({
                        message: "Quantity decremented successfully",
                        s,
                      });
                    }
                  }
                );
              }
            }
          });
        }
      }
    );
  } catch (error) {
    console.error("Error decrementing quantity:", error);
    res.status(500).json({
      message: "An error occurred while decrementing quantity",
      error: error.message,
    });
  }
};

// Remove Product From Cart
const removeProductFromCart = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user_id;
    const product_id = req.params.productId;

    const sqlQuery = `
          SELECT
              cart.*
          FROM
              cart
          INNER JOIN
              users ON cart.user_id = users.regitser_user_id
          INNER JOIN
              products ON cart.product_id = products.product_id
          WHERE
              users.regitser_user_id = ?
          AND
              products.product_id = ?;
        `;

    db.query(sqlQuery, [userId, product_id], (err, success) => {
      if (err) {
        return res
          .status(400)
          .json(`Error While Fetching Cart Items For Removing ${err}`);
      }
      if (success.length <= 0) {
        return res.status(404).json({ message: "Cart not found" });
      }
      db.query(
        "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
        [userId, product_id],
        (err, suc) => {
          if (err) {
            return res.status(400).json(`Error While Deleting Cart : ${err}`);
          } else {
            return res
              .status(200)
              .json({ message: "Cart Removed Successfull" });
          }
        }
      );
    });
  } catch (error) {
    console.error("Error removing product from the cart:", error);
    res.status(500).json({
      message: "An error occurred while removing the product from the cart",
      error: error.message,
    });
  }
};

module.exports = {
  addToCart,
  viewCart,
  decrementQuantity,
  removeProductFromCart,
};
