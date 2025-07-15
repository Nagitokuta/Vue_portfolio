// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "ユーザー名は必須です"],
      unique: true,
      trim: true,
      minlength: [3, "ユーザー名は3文字以上で入力してください"],
      maxlength: [20, "ユーザー名は20文字以下で入力してください"],
    },
    email: {
      type: String,
      required: [true, "メールアドレスは必須です"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "有効なメールアドレスを入力してください",
      ],
    },
    password: {
      type: String,
      required: [true, "パスワードは必須です"],
      minlength: [6, "パスワードは6文字以上で入力してください"],
    },
    profile: {
      firstName: String,
      lastName: String,
      bio: String,
      avatar: String,
    },
  },
  {
    timestamps: true, // createdAt, updatedAtを自動追加
  }
);

module.exports = mongoose.model("User", userSchema);
