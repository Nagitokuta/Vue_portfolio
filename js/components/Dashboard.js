const Dashboard = {
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h2>オンラインポートフォリオ - ダッシュボード</h2>
        <p class="welcome-text">こんにちは、{{ username }}さん！</p>
        <div class="nav-buttons">
          <button @click="logout" class="btn btn-logout">ログアウト</button>
        </div>
      </div>
      
      <div class="menu-bar">
        <button @click="activeTab = 'projects'" :class="{ active: activeTab === 'projects' }" class="tab-btn">
          プロジェクト一覧
        </button>
        <button @click="goToTemplates" class="tab-btn">テンプレート選択</button>
        <button @click="goToPortfolio" class="tab-btn">公開・共有</button>
      </div>
      
      <div v-if="activeTab === 'projects'" class="project-section">
        <div class="project-list">
          <div v-if="projects.length === 0" class="empty-state">
            <p>まだプロジェクトがありません。</p>
            <p>最初のプロジェクトを追加してみましょう！</p>
          </div>
          
          <div
            v-for="(project, index) in projects"
            :key="project.id"
            class="project-item"
          >
            <div class="project-info">
              <h3>{{ project.title }}</h3>
              <p class="project-summary">{{ project.summary }}</p>
              <p class="project-period">{{ project.start }} ～ {{ project.end }}</p>
            </div>
            <div class="project-actions">
              <button @click="editProject(project)" class="btn btn-edit">編集</button>
              <button @click="confirmDelete(project)" class="btn btn-delete">削除</button>
            </div>
          </div>
        </div>
        
        <button class="add-project-btn" @click="addProject">
          ＋ プロジェクト追加
        </button>
      </div>
      
      <!-- 削除確認モーダル -->
      <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
        <div class="modal-content" @click.stop>
          <h3>プロジェクトを削除しますか？</h3>
          <p>「{{ deleteTarget.title }}」を削除します。この操作は取り消せません。</p>
          <div class="modal-actions">
            <button @click="executeDelete" class="btn btn-danger">削除</button>
            <button @click="cancelDelete" class="btn btn-secondary">キャンセル</button>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      username: "demo",
      activeTab: "projects",
      showDeleteModal: false,
      deleteTarget: null,
      projects: [
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
        {
          id: 2,
          title: "モバイルアプリ開発",
          start: "2024-04-01",
          end: "2024-06-30",
          summary: "スマートフォン向けアプリを開発",
          details:
            "React Nativeを使用してクロスプラットフォームアプリを開発しました。",
          role: "アプリ開発担当",
        },
      ],
    };
  },

  methods: {
    addProject() {
      this.$router.push("/project/edit");
    },

    editProject(project) {
      this.$router.push(`/project/edit/${project.id}`);
    },

    confirmDelete(project) {
      this.deleteTarget = project;
      this.showDeleteModal = true;
    },

    executeDelete() {
      if (this.deleteTarget) {
        this.projects = this.projects.filter(
          (p) => p.id !== this.deleteTarget.id
        );
        this.cancelDelete();
      }
    },

    cancelDelete() {
      this.showDeleteModal = false;
      this.deleteTarget = null;
    },

    goToTemplates() {
      this.$router.push("/templates");
    },

    goToPortfolio() {
      this.$router.push("/portfolio");
    },

    logout() {
      this.$router.push("/login");
    },
  },
};
