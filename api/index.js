require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Transaction = require("./models/transaction-model");

const app = express();

// jVV2UaCjs39SpjDT
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connecting mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(cors());
app.use(express.json());

app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find({}).exec();
    return res.json(transactions);
  } catch (e) {
    return res.status(500).json("something error...");
  }
});

app.post("/api/transaction", async (req, res) => {
  const { name, price, description, datetime } = req.body;
  const transactionDoc = await Transaction.create({
    name,
    price,
    description,
    datetime,
  });
  return res.json(transactionDoc);
});

app.listen(4000, () => {
  console.log(`port on 4000...`);
});
