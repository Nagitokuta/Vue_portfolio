const { createApp } = Vue;

const App = {
  components: {
    Login,
    Register,
    Dashboard,
    ProjectForm,
  },

  data() {
    return {
      currentView: "login", // 現在表示中の画面
      currentUser: null,
      projects: [
        // サンプルデータ
        {
          id: 1,
          title: "Webサイト制作",
          start: "2024-01-01",
          end: "2024-03-31",
          summary: "企業のコーポレートサイトを制作",
          details:
            "HTML、CSS、JavaScriptを使用してレスポンシブなWebサイトを制作しました。",
          role: "フロントエンド開発担当",
        },
      ],
      editingProject: null,
    };
  },

  template: `
    <div class="app-container">
      <!-- ログイン画面 -->
      <Login 
        v-if="currentView === 'login'"
        @login="handleLogin"
        @toRegister="currentView = 'register'"
      />
      
      <!-- アカウント作成画面 -->
      <Register 
        v-if="currentView === 'register'"
        @register="handleRegister"
        @toLogin="currentView = 'login'"
      />
      
      <!-- ダッシュボード -->
      <Dashboard 
        v-if="currentView === 'dashboard'"
        :username="currentUser?.username"
        :projects="projects"
        @addProject="showProjectForm()"
        @editProject="showProjectForm"
        @deleteProject="deleteProject"
      />
      
      <!-- プロジェクト追加・編集フォーム -->
      <ProjectForm 
        v-if="currentView === 'projectForm'"
        :project="editingProject"
        @save="saveProject"
        @cancel="currentView = 'dashboard'"
      />
    </div>
  `,

  methods: {
    handleLogin(credentials) {
      // 簡易的なログイン処理
      this.currentUser = { username: credentials.username };
      this.currentView = "dashboard";
    },

    handleRegister(userData) {
      // 簡易的な登録処理
      this.currentUser = { username: userData.username };
      this.currentView = "dashboard";
    },

    showProjectForm(project = null) {
      this.editingProject = project;
      this.currentView = "projectForm";
    },

    saveProject(projectData) {
      if (this.editingProject) {
        // 編集の場合
        const index = this.projects.findIndex((p) => p.id === projectData.id);
        if (index !== -1) {
          this.projects[index] = projectData;
        }
      } else {
        // 新規追加の場合
        this.projects.push(projectData);
      }

      this.editingProject = null;
      this.currentView = "dashboard";
    },

    deleteProject(projectId) {
      this.projects = this.projects.filter((p) => p.id !== projectId);
    },
  },
};

// アプリケーションをマウント
createApp(App).mount("#app");
