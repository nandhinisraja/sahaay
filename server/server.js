const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// Home Route
// ===============================
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Sahaay API is running"
  });
});

// ===============================
// Health Check
// ===============================
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Sahaay server is healthy"
  });
});

// ===============================
// Analyze Route
// ===============================
app.post("/api/analyze", (req, res) => {
  try {
    const {
      problem,
      location,
      language,
      message
    } = req.body;

    // --------------------------------
    // Validate required fields
    // --------------------------------
    if (!problem || !location || !language) {
      return res.status(400).json({
        status: "error",
        message: "Problem, location and language are required"
      });
    }

    // --------------------------------
    // Text to analyze
    // --------------------------------
    // If message is provided, analyze it.
    // Otherwise analyze the problem field.
    const text = (
      message || problem
    ).toLowerCase().trim();

    // --------------------------------
    // Strong scam patterns
    // --------------------------------
    const scamPatterns = [
      "click this link",
      "click the link",
      "click here to claim",
      "click here",
      "claim your prize",
      "claim prize",
      "you have won",
      "you won",
      "congratulations you won",
      "congratulations you have won",
      "you are a winner",
      "lottery winner",
      "cash prize",
      "free money",
      "send money",
      "send payment",
      "transfer money",
      "pay immediately",
      "payment immediately",
      "urgent payment",
      "share your otp",
      "share otp",
      "give me your otp",
      "tell me your otp",
      "send your otp",
      "share your password",
      "give me your password",
      "verify your account immediately",
      "verify immediately",
      "account will be blocked",
      "account will be suspended",
      "account has been blocked",
      "account has been suspended",
      "limited time offer",
      "act immediately",
      "act now",
      "respond immediately",
      "send your bank details",
      "share bank details"
    ];

    // --------------------------------
    // Individual suspicious indicators
    // --------------------------------
    const suspiciousWords = [
      "otp",
      "password",
      "winner",
      "prize",
      "urgent",
      "blocked",
      "suspended",
      "lottery",
      "refund",
      "cashback"
    ];

    // --------------------------------
    // Find strong scam patterns
    // --------------------------------
    const foundPatterns = scamPatterns.filter((pattern) =>
      text.includes(pattern)
    );

    // --------------------------------
    // Find suspicious words
    // --------------------------------
    const foundWords = suspiciousWords.filter((word) =>
      text.includes(word)
    );

    // --------------------------------
    // Calculate risk
    // --------------------------------
    let risk = "LOW RISK";

    // Two or more strong patterns = HIGH
    if (foundPatterns.length >= 2) {
      risk = "HIGH RISK";
    }

    // One strong pattern + suspicious word
    else if (
      foundPatterns.length >= 1 &&
      foundWords.length >= 1
    ) {
      risk = "HIGH RISK";
    }

    // One strong pattern OR multiple suspicious words
    else if (
      foundPatterns.length >= 1 ||
      foundWords.length >= 2
    ) {
      risk = "MEDIUM RISK";
    }

    // --------------------------------
    // Combine detected indicators
    // --------------------------------
    const detectedIndicators = [
      ...foundPatterns,
      ...foundWords
    ];

    const uniqueIndicators = [
      ...new Set(detectedIndicators)
    ];

    // --------------------------------
    // Generate message
    // --------------------------------
    let resultMessage;

    if (risk === "HIGH RISK") {
      resultMessage =
        "This message contains several strong scam indicators. Do not click links, share OTPs or passwords, or send money without verification.";
    } else if (risk === "MEDIUM RISK") {
      resultMessage =
        "This message contains some suspicious indicators. Verify the sender and information before taking any action.";
    } else {
      resultMessage =
        "No obvious suspicious indicators were detected.";
    }

    // --------------------------------
    // Response
    // --------------------------------
    return res.json({
      status: "success",
      risk: risk,
      suspiciousWords: uniqueIndicators,
      message: resultMessage
    });

  } catch (error) {
    console.error("Analyze API Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

// ===============================
// 404 Route
// ===============================
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "API endpoint not found"
  });
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Sahaay server running on port ${PORT}`);
});