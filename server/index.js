// index.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// データベース接続
const connectDB = require("./config/database");

// ルーターのインポート
const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth");
const projectsRouter = require("./routes/projects");

const app = express();
const PORT = process.env.PORT || 3000;

// データベースに接続
connectDB();

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// ルーティングの設定
app.use("/api", apiRouter);
app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);

// ルートエンドポイント
app.get("/", (req, res) => {
  res.json({
    message: "オンラインポートフォリオ API Server",
    version: "1.0.0",
    database: "MongoDB Atlas",
    endpoints: {
      api: "/api",
      auth: "/api/auth",
      projects: "/api/projects",
    },
    timestamp: new Date().toISOString(),
  });
});

// ヘルスチェック用エンドポイント
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    database: "Connected to MongoDB Atlas",
    timestamp: new Date().toISOString(),
  });
});

// 404エラーハンドリング
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "エンドポイントが見つかりません",
  });
});

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "サーバーエラーが発生しました",
  });
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`🚀 APIサーバーが http://localhost:${PORT} で起動しました`);
  console.log(`📊 ヘルスチェック: http://localhost:${PORT}/health`);
  console.log(`📋 API一覧: http://localhost:${PORT}/api/status`);
});
