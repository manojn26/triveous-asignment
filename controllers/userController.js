const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db-confg");

const { validationResult } = require("express-validator");

// User Registration Controller
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  //   Validating the incoming request values
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // check if already registered user

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) {
        console.log(
          `THERE WAS AN ERROR WHILE SEARCHIN FOR THE EXISTING USER ${err}`
        );
        return res
          .status(400)
          .json(
            "THERE WAS AN ERROR WHILE SEARCHIN FOR THE EXISTING USER" + err
          );
      } else {
        // Checking If Already Existing User
        const checking = result[0];
        if (checking) {
          return res.status(400).json({ message: "User Already Registered" });
        } else {
          const createUser = async () => {
            const hashedPassword = await bcrypt.hash(password, 10);

            let createdUser;
            let values = [email, hashedPassword];

            db.query(
              `INSERT INTO users (email, password) VALUES (?, ?)`,
              values,
              (err, result) => {
                if (err) {
                  console.log(
                    `THERE WAS AN ERROR WHILE INSERTING DATA INTO USERS TABLE ${err}`
                  );
                  return res
                    .status(400)
                    .json(
                      "THERE WAS AN ERROR WHILE INSERTING DATA INTO USERS TABLE " +
                        err
                    );
                }
                createdUser = result;
                res.status(201).send(`REGSTRATION SUCCESFULL`);
              }
            );
          };
          createUser();
        }
      }
    });
  } catch (error) {
    console.error("Error Registering User:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Login Controller

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) {
        console.log(`ERROR WHILE FETCHING DATA FOR LOGIN ${err} `);
        return res
          .status(400)
          .json(`ERROR WHILE FETCHING DATA FOR LOGIN ${err} `);
      } else {
        const logingUser = async () => {
          if (!result[0]) {
            return res
              .status(400)
              .json("THERE IS NO USER MATCHING WITH THESE DETAILS");
          } else {
            const {
              regitser_user_id,
              email,
              password: userPassword,
            } = result[0];
            const passwordMatch = await bcrypt.compare(password, userPassword);
            if (!passwordMatch) {
              return res.status(401).json({ message: "Incorrect Password" });
            }
            // Create and JWT Token
            const token = jwt.sign(
              { user_id: regitser_user_id },
              process.env.SECRET_KEY,
              {
                expiresIn: "1h",
              }
            );
            res.status(200).json({ message: "Login Successful", token });
          }
        };

        logingUser();
      }
    });
  } catch (error) {
    console.error("Error while login:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { registerUser, loginUser };
