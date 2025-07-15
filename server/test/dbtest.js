// test/dbtest.js

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Project = require("../models/Project");

async function testDatabase() {
  try {
    // データベースに接続
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB接続成功");

    // テストユーザーの作成
    const testUser = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      profile: {
        firstName: "テスト",
        lastName: "ユーザー",
        bio: "これはテストユーザーです",
      },
    });

    // 既存のテストユーザーを削除（重複エラー回避）
    await User.deleteOne({ username: "testuser" });

    // ユーザーを保存
    const savedUser = await testUser.save();
    console.log("✅ テストユーザー作成成功:", savedUser.username);

    // テストプロジェクトの作成
    const testProject = new Project({
      title: "テストプロジェクト",
      summary: "これはテスト用のプロジェクトです",
      details: "プロジェクトの詳細な説明がここに入ります。",
      role: "フルスタック開発者",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-03-31"),
      technologies: ["JavaScript", "Node.js", "MongoDB"],
      user: savedUser._id,
    });

    const savedProject = await testProject.save();
    console.log("✅ テストプロジェクト作成成功:", savedProject.title);

    // データの取得テスト
    const users = await User.find();
    const projects = await Project.find().populate("user", "username email");

    console.log("📊 データベース内容:");
    console.log("ユーザー数:", users.length);
    console.log("プロジェクト数:", projects.length);

    // テストデータの削除
    await User.deleteOne({ _id: savedUser._id });
    await Project.deleteOne({ _id: savedProject._id });
    console.log("🧹 テストデータを削除しました");
  } catch (error) {
    console.error("❌ データベーステストエラー:", error.message);
  } finally {
    // 接続を閉じる
    await mongoose.connection.close();
    console.log("🔌 データベース接続を閉じました");
  }
}

// テスト実行
testDatabase();
