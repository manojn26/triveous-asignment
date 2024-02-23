const db = require("../config/db-confg");

// Creating The New Products
const insertProduct = async (req, res) => {
  try {
    // Checking if all fields are provided in request body
    const requireFields = [
      "product_name",
      "category",
      "price",
      "description",
      "image",
      "quantity",
    ];

    const missingFields = requireFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    } else {
      const {
        product_name,
        category,
        price,
        description,
        image,
        availability,
        quantity,
      } = req.body;
      const user_id = req.user_id;

      let values = [
        product_name,
        category,
        price,
        description,
        image,
        availability,
        quantity,
        user_id,
      ];
      db.query(
        "INSERT INTO products (product_name,category,price,description,image,availability,quantity,user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        values,
        (err, success) => {
          if (err) {
            console.log(
              `THERE WAS AN ERROR WHILE INSERTING DATA INTO PRODUCTS TABLE ${err}`
            );
            return res
              .status(400)
              .json(
                `THERE WAS AN ERROR WHILE INSERTING DATA INTO PRODUCTS TABLE ${err}`
              );
          }
          res.status(201).json("PRODUCTS INSERTED SUCCESSFULLY");
        }
      );
    }
  } catch (error) {
    res.status(500).json({
      message: "Error Inserting Product",
      error: error.message,
    });
  }
};

// To Get all the Categories
const getCategories = async (req, res) => {
  try {
    db.query("SELECT category FROM products", (err, success) => {
      if (err) {
        return res
          .status(400)
          .send(`ERROR WHILE FETCHING THE CATEGORIES ${err}`);
      } else {
        const allCategories = success.map((val) => {
          return val.category;
        });
        if (allCategories.length === 0) {
          return res.status(404).json({ message: "No Categories Found" });
        }
        res.status(200).send(allCategories);
      }
    });
  } catch (error) {
    console.error("Error Fetching Categories: ", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// To Get Products by Categories
const getProductsByCategory = async (req, res) => {
  const { categoryName } = req.params;
  try {
    db.query(
      "SELECT * FROM products WHERE category = ?",
      [categoryName],
      (err, success) => {
        if (err) {
          return res
            .status(400)
            .send(
              `ERROR WHILE FETCHING PRODUCTS FOR SPECIFIED CATEGORY ${err}`
            );
        } else {
          if (success.length === 0) {
            return res.status(404).json({
              message: `No products found in category ${categoryName}.`,
            });
          }
          return res.status(200).send(success);
        }
      }
    );
  } catch (error) {
    console.error(
      `Error fetching products in category ${categoryName}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// To Get Product Details By Id
const getProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    db.query(
      "SELECT * FROM products WHERE product_id = ?",
      [productId],
      (err, success) => {
        if (err) {
          return res
            .status(400)
            .json({ message: `Error While Fetching Products By Id ${err}` });
        } else {
          if (success.length === 0) {
            return res
              .status(400)
              .json(`There is no Product matching with this id ${productId}`);
          }
          return res.status(200).json(success);
        }
      }
    );
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Decrement product quantity when product gets added to Cart
const decrementProductQuantity = async (productId, quantityToDecrement) => {
  try {
    db.query(
      "SELECT * FROM products WHERE product_id = ?",
      [productId],
      (err, success) => {
        if (err) {
          throw new Error(`Error While Fetching Products By Id ${err}`);
        } else {
          if (success.length === 0) {
            throw new Error(
              `There is no Product matching with this id ${productId}`
            );
          }

          let updatedQuantity = success[0].quantity - quantityToDecrement;

          db.query(
            "UPDATE products SET quantity = ? WHERE product_id = ?",
            [productId, updatedQuantity],
            (err, succ) => {
              if (err) {
                throw new Error(`Error while updating the Quantity ${err}`);
              } else {
                console.log(succ.affectedRows);
              }
            }
          );
        }
      }
    );
  } catch (error) {}
};

module.exports = {
  insertProduct,
  getCategories,
  getProductsByCategory,
  getProductById,
  decrementProductQuantity,
};
