const express = require("express");
const db = require("./config/db-confg");
const createUserRegisterTable = require("./models/user-model");
const dotenv = require("dotenv");

// Routes
const userRouter = require("./routes/userRoutes");

const app = express();
dotenv.config();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome To E-Commerce API Project");
});

app.use("/auth", userRouter);

const PORT = 5000;

db.connect((err) => {
  if (err) {
    console.log(`ERROR WHILE CONNECTING TO DB ${err}`);
  } else {
    console.log(`SUCCESSFULLY CONNECTED TO MYSQL DATABASE`);
    createUserRegisterTable();
  }
});

app.listen(PORT, () => {
  console.log(`SERVER STARTED AND LISTENING AT PORT : ${PORT}`);
});
