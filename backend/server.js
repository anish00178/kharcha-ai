const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Kharcha-AI Backend Running 🚀",
  });
});

// ==========================
// GET ALL EXPENSES
// ==========================
app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(expenses);
  } catch (error) {
    console.error("Expense Fetch Error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==========================
// CREATE EXPENSE
// ==========================
app.post("/api/expenses", async (req, res) => {
  try {
    const { amount, category } = req.body;

    const expense = await prisma.expense.create({
      data: {
        amount: Number(amount),
        category,
      },
    });

    res.json(expense);
  } catch (error) {
    console.error("Expense Save Error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==========================
// GEMINI ANALYZE
// ==========================
app.post("/api/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Extract only JSON.

Example:

{
  "amount": 250,
  "category": "Food"
}

Sentence:
${text}
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    res.json({
      success: true,
      result: response.text(),
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==========================
// RECEIPT SCANNER
// ==========================
app.post("/api/scan-receipt", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Extract merchant and amount.

Return only JSON.

Example:

{
  "merchant":"Dominos",
  "amount":560
}
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;

    res.json({
      success: true,
      result: response.text(),
    });
  } catch (error) {
    console.error("Receipt Scan Error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database Connected");
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error);
  }
});

// Close Prisma on exit
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});