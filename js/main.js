const { createApp } = Vue;

const App = {
  template: `
    <div class="app-container">
      <!-- ルーターによって表示されるコンポーネント -->
      <router-view></router-view>
    </div>
  `,
};

// アプリケーションを作成してルーターを使用
const app = createApp(App);
app.use(window.AppRouter);
app.mount("#app");
