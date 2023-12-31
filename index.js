const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.m9rcgwt.mongodb.net/registrationFormDB`
);

const registrationSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  gender: String,
  phonenumber: String,
  username: String,
  email: String,
  password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      gender,
      phonenumber,
      username,
      email,
      password,
    } = req.body;

    const existingUser = await Registration.findOne({ email: email });
    if (!existingUser) {
      const registrationData = new Registration({
        firstname,
        lastname,
        gender,
        phonenumber,
        username,
        email,
        password,
      });
      await registrationData.save();
      res.redirect("/sucess");
    } else {
      console.log("User already exist");
      res.redirect("/error");
    }
  } catch (error) {
    console.log(error);
    res.redirect("error");
  }
});

app.get("/sucess", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
