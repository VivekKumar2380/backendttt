const express = require("express");
const { connection } = require("./db");
const { UserRouter } = require("./routes/User.routes");
const { auth } = require("./middleware/auth.middleware");
const { UserModel } = require("./model/User.model");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(UserRouter);
app.use(auth);
app.get("/profile", async (req, res) => {
  // const token=jwt.sign({id:user._id,username:user.name}, 'india');
  // res.send(token)
  try {
    const user = await UserModel.findOne(req.body.id);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});
app.post("/calculateemi", async (req, res) => {
  const { loanAmount, annualInterestRate, tenureInMonths } = req.body;
  const IntrestRate = annualInterestRate / 12 / 100;

  const EMI =
    (loanAmount * IntrestRate * Math.pow(1 + IntrestRate, tenureInMonths)) /
    (Math.pow(1 + IntrestRate, tenureInMonths) - 1);
  const IntrestPayable = EMI * tenureInMonths - loanAmount;
  const totalPayment = EMI * tenureInMonths;
  res.status(200).send({ EMI, IntrestPayable, totalPayment });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logged Out successfully");
});
app.listen("8080", async () => {
  try {
    await connection;
    console.log("Connected to the Db");
    console.log("server is running at port 8080");
  } catch (error) {
    console.log(error.message);
  }
});
