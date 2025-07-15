// routes/api.js

const express = require("express");
const router = express.Router();

// サンプルエンドポイント：GET /api/hello
router.get("/hello", (req, res) => {
  res.json({
    message: "Hello from /api/hello!",
    timestamp: new Date().toISOString(),
  });
});

// サンプルエンドポイント：GET /api/status
router.get("/status", (req, res) => {
  res.json({
    status: "API is working",
    endpoints: ["GET /api/hello", "GET /api/status"],
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
