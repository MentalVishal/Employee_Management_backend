const express = require("express");
const cors = require("cors");
const { Connection } = require("./db");
const { employeeRouter } = require("./Routes/userRouter");
const { userModel } = require("./Models/userModel");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { blackListModel } = require("./Models/blacklistModel");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/employees", employeeRouter);

app.post("/signup", async (req, res) => {
  const { email, password, confirm_password } = req.body;
  try {
    if (password != confirm_password) {
      res.status(400).json({ error: "Confirm Password is Mismatch" });
    } else {
      const user = await userModel.findOne({ email });
      if (user) {
        res.status(400).json({ error: "User already exist with this email" });
      } else {
        bcrypt.hash(password, 5, async (err, hash) => {
          if (err) {
            res.status(400).json({ error: err });
          } else {
            const newUser = new userModel({ ...req.body, password: hash });
            await newUser.save();
            res.status(200).json({ msg: "Signup Successful..." });
          }
        });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          let token = jwt.sign({ email: email }, "masai");
          res.status(200).json({ msg: "Login Sucessfull...", token: token });
        } else {
          res.status(400).json({ error: "Check your Password" });
        }
      });
    } else {
      res.status(400).json({ error: "No user Exist..." });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

app.get("/logout", async (req, res) => {
  try {
    const token = req.header.authrization?.split(" ")[1];
    if (token) {
      const data = new blackListModel({ token: token });
      await data.save();
      res.status(200).json({ msg: "Logout Successful.." });
    } else {
      res.status(400).json({ err: "Token not Present" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

app.listen(process.env.port, async () => {
  try {
    await Connection;
    console.log("Connected to the Server");
    console.log(`Runnig at port ${process.env.port}`);
  } catch (err) {
    console.log(err);
  }
});
