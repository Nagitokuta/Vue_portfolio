const ProjectForm = {
  template: `
    <div class="project-form-container">
      <div class="form-header">
        <h2>プロジェクト{{ isEdit ? '編集' : '追加' }}</h2>
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
            <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
              キャンセル
            </button>
          </div>
        </form>
        
        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  `,

  props: {
    project: {
      type: Object,
      default: null,
    },
  },

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
      return this.project !== null;
    },
  },

  mounted() {
    if (this.isEdit) {
      // 編集モードの場合、既存データを設定
      this.form = { ...this.project };
    }
  },

  methods: {
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

      // プロジェクトデータを親コンポーネントに送信
      const projectData = {
        ...this.form,
        id: this.isEdit ? this.project.id : Date.now(), // 簡易的なID生成
      };

      this.$emit("save", projectData);
    },
  },
};
