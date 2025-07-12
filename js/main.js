// DOM読み込み完了後に実行
document.addEventListener("DOMContentLoaded", function () {
  // ボタン要素を取得
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");

  // ログインボタンのクリックイベント
  loginBtn.addEventListener("click", function () {
    showMessage("ログイン機能は次のステップで実装します！", "info");
  });

  // アカウント作成ボタンのクリックイベント
  signupBtn.addEventListener("click", function () {
    showMessage("アカウント作成機能は次のステップで実装します！", "info");
  });

  // ページ読み込み時のアニメーション
  animateWelcomeSection();
});

// メッセージ表示関数
function showMessage(message, type = "info") {
  // 既存のメッセージがあれば削除
  const existingMessage = document.querySelector(".message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // メッセージ要素を作成
  const messageDiv = document.createElement("div");
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = message;

  // スタイルを適用
  messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "info" ? "#3498db" : "#e74c3c"};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;

  // ページに追加
  document.body.appendChild(messageDiv);

  // 3秒後に自動削除
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        messageDiv.remove();
      }, 300);
    }
  }, 3000);
}

// ウェルカムセクションのアニメーション
function animateWelcomeSection() {
  const welcomeSection = document.querySelector(".welcome-section");

  // 初期状態を設定
  welcomeSection.style.opacity = "0";
  welcomeSection.style.transform = "translateY(30px)";

  // アニメーション実行
  setTimeout(() => {
    welcomeSection.style.transition = "all 0.8s ease-out";
    welcomeSection.style.opacity = "1";
    welcomeSection.style.transform = "translateY(0)";
  }, 100);
}

// CSSアニメーションを追加
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
