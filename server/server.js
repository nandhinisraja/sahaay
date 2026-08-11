const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Sahaay API is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Sahaay server is healthy"
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Sahaay server running on port ${PORT}`);
});