const ProjectForm = {
  template: `
    <div class="project-form-container">
      <div class="form-header">
        <h2>プロジェクト{{ isEdit ? '編集' : '追加' }}</h2>
        <button @click="goBack" class="btn btn-back">← ダッシュボードに戻る</button>
      </div>
      
      <div class="form-card">
        <form @submit.prevent="onSave" class="project-form">
          <div class="form-group">
            <label>タイトル：</label>
            <input 
              v-model="form.title" 
              type="text" 
              placeholder="プロジェクトのタイトルを入力"
              required 
              class="form-input"
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>開始日：</label>
              <input 
                v-model="form.start" 
                type="date" 
                required 
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>終了日：</label>
              <input 
                v-model="form.end" 
                type="date" 
                required 
                class="form-input"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>概要：</label>
            <input 
              v-model="form.summary" 
              type="text" 
              placeholder="プロジェクトの概要を入力"
              required 
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>詳細：</label>
            <textarea 
              v-model="form.details" 
              placeholder="プロジェクトの詳細を入力"
              required 
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>実績／役割：</label>
            <textarea 
              v-model="form.role" 
              placeholder="あなたの役割や実績を入力"
              required 
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>画像アップロード：</label>
            <input 
              @change="onFileChange" 
              type="file" 
              accept="image/*"
              class="form-file"
            />
            <div v-if="form.imagePreview" class="image-preview">
              <img :src="form.imagePreview" alt="プレビュー" />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">保存</button>
            <button type="button" @click="goBack" class="btn btn-secondary">
              キャンセル
            </button>
          </div>
        </form>
        
        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  `,

  data() {
    return {
      form: {
        title: "",
        start: "",
        end: "",
        summary: "",
        details: "",
        role: "",
        image: null,
        imagePreview: null,
      },
      error: "",
    };
  },

  computed: {
    isEdit() {
      return this.$route.params.id !== undefined;
    },

    projectId() {
      return this.$route.params.id;
    },
  },

  mounted() {
    if (this.isEdit) {
      // 編集モードの場合、プロジェクトデータを読み込み
      this.loadProject();
    }
  },

  methods: {
    loadProject() {
      // 実際のアプリではAPIからデータを取得
      // ここではサンプルデータを使用
      const sampleProjects = [
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
      ];

      const project = sampleProjects.find((p) => p.id == this.projectId);
      if (project) {
        this.form = { ...project };
      }
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.image = file;

        // プレビュー用のDataURLを作成
        const reader = new FileReader();
        reader.onload = (e) => {
          this.form.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    onSave() {
      // バリデーション
      if (
        !this.form.title ||
        !this.form.start ||
        !this.form.end ||
        !this.form.summary ||
        !this.form.details ||
        !this.form.role
      ) {
        this.error = "すべての項目を入力してください。";
        return;
      }

      if (new Date(this.form.start) > new Date(this.form.end)) {
        this.error = "終了日は開始日より後の日付を選択してください。";
        return;
      }

      this.error = "";

      // 実際のアプリではAPIにデータを送信
      console.log("プロジェクトを保存:", this.form);

      // ダッシュボードに戻る
      this.$router.push("/dashboard");
    },

    goBack() {
      this.$router.push("/dashboard");
    },
  },
};
