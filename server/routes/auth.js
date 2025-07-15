// routes/auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// ユーザー登録API
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 入力値のバリデーション
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "すべての項目を入力してください",
      });
    }

    // パスワードの長さチェック
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "パスワードは6文字以上で入力してください",
      });
    }

    // 既存ユーザー確認
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "ユーザー名またはメールアドレスは既に使用されています",
      });
    }

    // パスワードをハッシュ化
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 新規ユーザー作成
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // JWTトークン生成
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      message: "ユーザー登録が完了しました",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "サーバーエラーが発生しました",
    });
  }
});

// ログインAPI
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 入力チェック
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "ユーザー名とパスワードを入力してください",
      });
    }

    // ユーザー検索（ユーザー名またはメールアドレスで検索）
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "ユーザー名またはパスワードが間違っています",
      });
    }

    // パスワードチェック
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "ユーザー名またはパスワードが間違っています",
      });
    }

    // JWTトークン発行
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "ログインに成功しました",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "サーバーエラーが発生しました",
    });
  }
});

// ユーザー情報取得API（認証が必要）
router.get("/me", auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        profile: req.user.profile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "サーバーエラーが発生しました",
    });
  }
});

// ログアウトAPI（トークンの無効化は実装しないが、フロントエンドでトークンを削除）
router.post("/logout", auth, async (req, res) => {
  res.json({
    success: true,
    message: "ログアウトしました",
  });
});

module.exports = router;
