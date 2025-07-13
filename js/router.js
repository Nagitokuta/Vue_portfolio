// js/router.js
const { createRouter, createWebHashHistory } = VueRouter;

// ルート定義
const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/project/edit/:id?", // ?は新規追加時のid省略対応
    name: "ProjectEdit",
    component: ProjectForm,
  },
  {
    path: "/templates",
    name: "Templates",
    component: {
      template: `
        <div class="template-container">
          <div class="template-header">
            <h2>テンプレート選択</h2>
          </div>
          <div class="template-content">
            <p>この機能は次のステップで実装します。</p>
            <button @click="$router.push('/dashboard')" class="btn btn-primary">
              ダッシュボードに戻る
            </button>
          </div>
        </div>
      `,
    },
  },
  {
    path: "/portfolio",
    name: "Portfolio",
    component: {
      template: `
        <div class="portfolio-container">
          <div class="portfolio-header">
            <h2>ポートフォリオプレビュー</h2>
          </div>
          <div class="portfolio-content">
            <p>この機能は次のステップで実装します。</p>
            <button @click="$router.push('/dashboard')" class="btn btn-primary">
              ダッシュボードに戻る
            </button>
          </div>
        </div>
      `,
    },
  },
  // デフォルト（アクセスがなかった場合）はログインへリダイレクト
  {
    path: "/",
    redirect: "/login",
  },
];

// ルーター作成
const router = createRouter({
  history: createWebHashHistory(), // ハッシュモードを使用
  routes,
});

// グローバルに公開
window.AppRouter = router;
