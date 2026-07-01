// 1. IMPORT OUR TOOLS
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

// 2. INITIALIZE THE SERVER AND DATABASE
const app = express();
const prisma = new PrismaClient();

// 3. MIDDLEWARE
app.use(cors());
app.use(express.json());

// 4. GET ALL EXPENSES
app.get("/api/expenses", async (req, res) => {
  try {
    const allExpenses = await prisma.expense.findMany();
    res.json(allExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// 5. CREATE A NEW EXPENSE
app.post("/api/expenses", async (req, res) => {
  try {
    const { amount, category } = req.body;

    const newExpense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        category,
      },
    });

    res.json(newExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save expense" });
  }
});

// 6. START SERVER
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});