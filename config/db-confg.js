const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "chrsql",
  password: "chrome",
  database: "e-commerce",
});

module.exports = db;
