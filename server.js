const express = require("express");
const db = require("./config/db-confg");
const createUserRegisterTable = require("./models/user-model");
const createProductTable = require("./models/product-model");
const createCartTable = require("./models/cart-model");
const dotenv = require("dotenv");

// Routes
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");

const app = express();
dotenv.config();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome To E-Commerce API Project");
});

app.use("/auth", userRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);

const PORT = 5000;

db.connect((err) => {
  if (err) {
    console.log(`ERROR WHILE CONNECTING TO DB ${err}`);
  } else {
    console.log(`SUCCESSFULLY CONNECTED TO MYSQL DATABASE`);
    createUserRegisterTable();
    createProductTable();
    createCartTable();
  }
});

app.listen(PORT, () => {
  console.log(`SERVER STARTED AND LISTENING AT PORT : ${PORT}`);
});
