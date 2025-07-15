// models/Project.js

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "プロジェクトタイトルは必須です"],
      trim: true,
      maxlength: [100, "タイトルは100文字以下で入力してください"],
    },
    summary: {
      type: String,
      required: [true, "概要は必須です"],
      maxlength: [200, "概要は200文字以下で入力してください"],
    },
    details: {
      type: String,
      required: [true, "詳細は必須です"],
      maxlength: [1000, "詳細は1000文字以下で入力してください"],
    },
    role: {
      type: String,
      required: [true, "役割は必須です"],
      maxlength: [200, "役割は200文字以下で入力してください"],
    },
    startDate: {
      type: Date,
      required: [true, "開始日は必須です"],
    },
    endDate: {
      type: Date,
      required: [true, "終了日は必須です"],
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        url: String,
        caption: String,
      },
    ],
    links: {
      demo: String,
      github: String,
      website: String,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    priority: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 終了日が開始日より後であることを検証
projectSchema.pre("save", function (next) {
  if (this.endDate <= this.startDate) {
    next(new Error("終了日は開始日より後の日付を設定してください"));
  }
  next();
});

// プロジェクトの期間を計算する仮想プロパティ
projectSchema.virtual("duration").get(function () {
  const diffTime = Math.abs(this.endDate - this.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

module.exports = mongoose.model("Project", projectSchema);
