// routes/projects.js

const express = require("express");
const Project = require("../models/Project");
const auth = require("../middleware/auth");

const router = express.Router();

// すべてのプロジェクトルートに認証を適用
router.use(auth);

// プロジェクト一覧取得（ログインユーザーのプロジェクトのみ）
router.get("/", async (req, res) => {
  try {
    const { status, sort = "-createdAt", page = 1, limit = 10 } = req.query;

    // フィルター条件
    const filter = { user: req.user._id };
    if (status) {
      filter.status = status;
    }

    // ソート条件
    let sortOption = {};
    switch (sort) {
      case "title":
        sortOption = { title: 1 };
        break;
      case "-title":
        sortOption = { title: -1 };
        break;
      case "startDate":
        sortOption = { startDate: 1 };
        break;
      case "-startDate":
        sortOption = { startDate: -1 };
        break;
      case "priority":
        sortOption = { priority: -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // ページネーション
    const skip = (page - 1) * limit;

    const projects = await Project.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "username email");

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      data: projects,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: projects.length,
        totalItems: total,
      },
    });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({
      success: false,
      message: "プロジェクトの取得に失敗しました",
    });
  }
});

// プロジェクト詳細取得
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("user", "username email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "プロジェクトが見つかりません",
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({
      success: false,
      message: "プロジェクトの取得に失敗しました",
    });
  }
});

// プロジェクト作成
router.post("/", async (req, res) => {
  try {
    const {
      title,
      summary,
      details,
      role,
      startDate,
      endDate,
      technologies,
      links,
      status,
      priority,
    } = req.body;

    // バリデーション
    if (!title || !summary || !details || !role || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "すべての必須項目を入力してください",
      });
    }

    // 日付の検証
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "終了日は開始日より後の日付を設定してください",
      });
    }

    const project = new Project({
      title,
      summary,
      details,
      role,
      startDate: start,
      endDate: end,
      technologies: technologies || [],
      links: links || {},
      status: status || "draft",
      priority: priority || 0,
      user: req.user._id,
    });

    await project.save();

    // 作成されたプロジェクトを取得（populateして返す）
    const savedProject = await Project.findById(project._id).populate(
      "user",
      "username email"
    );

    res.status(201).json({
      success: true,
      message: "プロジェクトが作成されました",
      data: savedProject,
    });
  } catch (error) {
    console.error("Create project error:", error);

    if (error.message.includes("終了日は開始日より後の日付")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "プロジェクトの作成に失敗しました",
    });
  }
});

// プロジェクト更新
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      summary,
      details,
      role,
      startDate,
      endDate,
      technologies,
      links,
      status,
      priority,
    } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "プロジェクトが見つかりません",
      });
    }

    // 日付の検証
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start) {
        return res.status(400).json({
          success: false,
          message: "終了日は開始日より後の日付を設定してください",
        });
      }
    }

    // 更新
    if (title !== undefined) project.title = title;
    if (summary !== undefined) project.summary = summary;
    if (details !== undefined) project.details = details;
    if (role !== undefined) project.role = role;
    if (startDate !== undefined) project.startDate = new Date(startDate);
    if (endDate !== undefined) project.endDate = new Date(endDate);
    if (technologies !== undefined) project.technologies = technologies;
    if (links !== undefined) project.links = links;
    if (status !== undefined) project.status = status;
    if (priority !== undefined) project.priority = priority;

    await project.save();

    // 更新されたプロジェクトを取得
    const updatedProject = await Project.findById(project._id).populate(
      "user",
      "username email"
    );

    res.json({
      success: true,
      message: "プロジェクトが更新されました",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);

    if (error.message.includes("終了日は開始日より後の日付")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "プロジェクトの更新に失敗しました",
    });
  }
});

// プロジェクト削除
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "プロジェクトが見つかりません",
      });
    }

    await Project.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: "プロジェクトが削除されました",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      success: false,
      message: "プロジェクトの削除に失敗しました",
    });
  }
});

// プロジェクトの公開状態変更
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["draft", "published", "archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "無効なステータスです",
      });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true }
    ).populate("user", "username email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "プロジェクトが見つかりません",
      });
    }

    res.json({
      success: true,
      message: "ステータスが更新されました",
      data: project,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: "ステータスの更新に失敗しました",
    });
  }
});

// プロジェクトの優先度変更
router.patch("/:id/priority", async (req, res) => {
  try {
    const { priority } = req.body;

    if (typeof priority !== "number") {
      return res.status(400).json({
        success: false,
        message: "優先度は数値で指定してください",
      });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { priority },
      { new: true }
    ).populate("user", "username email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "プロジェクトが見つかりません",
      });
    }

    res.json({
      success: true,
      message: "優先度が更新されました",
      data: project,
    });
  } catch (error) {
    console.error("Update priority error:", error);
    res.status(500).json({
      success: false,
      message: "優先度の更新に失敗しました",
    });
  }
});

module.exports = router;
