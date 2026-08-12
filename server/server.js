const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Sahaay API is running"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Sahaay server is healthy"
  });
});

// Analyze route
app.post("/api/analyze", (req, res) => {
  const { problem, location, language } = req.body;

  if (!problem || !location || !language) {
    return res.status(400).json({
      status: "error",
      message: "Problem, location and language are required"
    });
  }

  const suspiciousWords = [
    "urgent",
    "winner",
    "prize",
    "click",
    "password",
    "otp",
    "verify",
    "bank",
    "payment",
    "blocked"
  ];

  const text = `${problem} ${location} ${language}`.toLowerCase();

  const foundWords = suspiciousWords.filter((word) =>
    text.includes(word)
  );

  const risk =
    foundWords.length >= 3
      ? "HIGH RISK"
      : foundWords.length >= 1
      ? "MEDIUM RISK"
      : "LOW RISK";

  res.json({
    status: "success",
    risk,
    suspiciousWords: foundWords,
    message:
      risk === "HIGH RISK"
        ? "This message contains several suspicious indicators."
        : risk === "MEDIUM RISK"
        ? "This message contains some suspicious indicators."
        : "No obvious suspicious indicators were detected."
  });
});

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Sahaay server running on port ${PORT}`);
});