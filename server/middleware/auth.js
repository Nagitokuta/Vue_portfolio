// middleware/auth.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // ヘッダーからトークンを取得
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "アクセストークンがありません",
      });
    }

    // トークンを検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ユーザー情報を取得
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "ユーザーが見つかりません",
      });
    }

    // リクエストオブジェクトにユーザー情報を追加
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "無効なトークンです",
    });
  }
};

module.exports = auth;
