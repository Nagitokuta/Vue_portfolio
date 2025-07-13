const Register = {
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2 class="register-title">アカウント作成</h2>
        
        <form @submit.prevent="onRegister" class="register-form">
          <div class="form-group">
            <label>ユーザー名：</label>
            <input 
              v-model="username" 
              type="text" 
              placeholder="ユーザー名を入力"
              required 
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>メールアドレス：</label>
            <input 
              v-model="email" 
              type="email" 
              placeholder="メールアドレスを入力"
              required 
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>パスワード：</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="パスワードを入力"
              required 
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>パスワード再入力：</label>
            <input 
              v-model="passwordConfirm" 
              type="password" 
              placeholder="パスワードを再入力"
              required 
              class="form-input"
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">作成</button>
            <button type="button" @click="goToLogin" class="btn btn-secondary">
              戻る
            </button>
          </div>
        </form>
        
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
      </div>
    </div>
  `,

  data() {
    return {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      error: "",
      success: "",
    };
  },

  methods: {
    onRegister() {
      // バリデーション
      if (
        !this.username ||
        !this.email ||
        !this.password ||
        !this.passwordConfirm
      ) {
        this.error = "すべての項目を入力してください。";
        this.success = "";
        return;
      }

      if (this.password !== this.passwordConfirm) {
        this.error = "パスワードが一致しません。";
        this.success = "";
        return;
      }

      if (this.password.length < 6) {
        this.error = "パスワードは6文字以上で入力してください。";
        this.success = "";
        return;
      }

      // 成功処理
      this.error = "";
      this.success =
        "アカウントが作成されました！ダッシュボードに移動します...";

      setTimeout(() => {
        this.$router.push("/dashboard");
      }, 1500);
    },

    goToLogin() {
      this.$router.push("/login");
    },
  },
};
