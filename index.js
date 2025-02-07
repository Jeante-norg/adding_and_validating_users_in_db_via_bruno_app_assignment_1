const express = require("express");
const { resolve } = require("path");
const mongoose = require("mongoose");
const userModel = require("./usermodel.js");
const bcrypt = require("bcrypt");

const app = express();
const port = 3010;

app.use(express.static("static"));
app.use(express.json());

const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://tejas:ZnR8mDSYTHA2azV1@cluster0.yg0kt.mongodb.net/test2"
    )
    .then(() => {
      console.log("Database connected.");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

app.post("/create", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await userModel.create({
      username,
      email,
      password: hashPassword,
    });

    res.status(201).json({
      success: true,
      message: "user successfully created.",
      data: newUser,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "failed to create user.",
    });
  }
});

app.listen(port, () => {
  connectDB();
  console.log(`Example app listening at http://localhost:${port}`);
});
