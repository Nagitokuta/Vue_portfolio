const Dashboard = {
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h2>オンラインポートフォリオ - ダッシュボード</h2>
        <p class="welcome-text">こんにちは、{{ username }}さん！</p>
      </div>
      
      <div class="menu-bar">
        <button @click="activeTab = 'projects'" :class="{ active: activeTab === 'projects' }" class="tab-btn">
          プロジェクト一覧
        </button>
        <button @click="activeTab = 'templates'" class="tab-btn">テンプレート選択</button>
        <button @click="activeTab = 'publish'" class="tab-btn">公開・共有</button>
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
              <button @click="$emit('editProject', project)" class="btn btn-edit">編集</button>
              <button @click="confirmDelete(project)" class="btn btn-delete">削除</button>
            </div>
          </div>
        </div>
        
        <button class="add-project-btn" @click="$emit('addProject')">
          ＋ プロジェクト追加
        </button>
      </div>
      
      <div v-if="activeTab === 'templates'" class="template-section">
        <h3>テンプレート選択</h3>
        <p>この機能は次のステップで実装します。</p>
      </div>
      
      <div v-if="activeTab === 'publish'" class="publish-section">
        <h3>公開・共有</h3>
        <p>この機能は次のステップで実装します。</p>
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

  props: {
    username: {
      type: String,
      default: "ユーザー",
    },
    projects: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      activeTab: "projects",
      showDeleteModal: false,
      deleteTarget: null,
    };
  },

  methods: {
    confirmDelete(project) {
      this.deleteTarget = project;
      this.showDeleteModal = true;
    },

    executeDelete() {
      if (this.deleteTarget) {
        this.$emit("deleteProject", this.deleteTarget.id);
        this.cancelDelete();
      }
    },

    cancelDelete() {
      this.showDeleteModal = false;
      this.deleteTarget = null;
    },
  },
};
