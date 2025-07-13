const Login = {
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2 class="login-title">オンラインポートフォリオ</h2>
        <p class="login-subtitle">ログイン</p>
        
        <form @submit.prevent="onLogin" class="login-form">
          <div class="form-group">
            <label>ユーザー名：</label>
            <input 
              v-model="username" 
              type="text" 
              placeholder="ユーザー名を入力（demo）"
              required 
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>パスワード：</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="パスワードを入力（password）"
              required 
              class="form-input"
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">ログイン</button>
            <button type="button" @click="goToRegister" class="btn btn-secondary">
              アカウント作成
            </button>
          </div>
        </form>
        
        <div v-if="error" class="error-message">{{ error }}</div>
        
        <div class="demo-info">
          <p><strong>デモ用ログイン情報：</strong></p>
          <p>ユーザー名: demo</p>
          <p>パスワード: password</p>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },

  methods: {
    onLogin() {
      // バリデーション
      if (!this.username || !this.password) {
        this.error = "ユーザー名とパスワードを入力してください。";
        return;
      }

      // 簡単な認証チェック
      if (this.username === "demo" && this.password === "password") {
        this.error = "";
        // ルーターを使ってダッシュボードに遷移
        this.$router.push("/dashboard");
      } else {
        this.error = "ユーザー名またはパスワードが間違っています。";
      }
    },

    goToRegister() {
      // ルーターを使ってアカウント作成画面に遷移
      this.$router.push("/register");
    },
  },
};
