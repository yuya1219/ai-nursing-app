/**
 * AI看護記録アプリケーション - インデックスページスクリプト
 */

// DOMが完全に読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
  // ログイン状態に応じたUIの更新
  updateUIBasedOnLoginState();
});

/**
 * ログイン状態に応じてUIを更新する関数
 */
function updateUIBasedOnLoginState() {
  // ローカルストレージからユーザー情報を取得
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  // ヘッダーのボタン表示エリアを取得
  const headerButtonsContainer = document.querySelector('header .d-flex');
  
  // ユーザー情報が存在する場合（ログイン済み）
  if (userInfo && userInfo.name) {
    // ログインボタンと新規登録ボタンを非表示にし、ユーザーメニューを表示
    headerButtonsContainer.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-primary dropdown-toggle" type="button" id="userMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fas fa-user me-2"></i><span id="userName">${userInfo.name}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuButton">
          <li><a class="dropdown-item" href="patient-form.html"><i class="fas fa-clipboard-list me-2"></i>患者情報入力</a></li>
          <li><a class="dropdown-item" href="history.html"><i class="fas fa-history me-2"></i>履歴</a></li>
          ${userInfo.role === 'admin' ? '<li><a class="dropdown-item" href="admin.html"><i class="fas fa-cog me-2"></i>管理者ページ</a></li>' : ''}
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" id="logoutButton"><i class="fas fa-sign-out-alt me-2"></i>ログアウト</a></li>
        </ul>
      </div>
    `;
    
    // ログアウトボタンのイベントリスナーを設定
    document.getElementById('logoutButton').addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  } else {
    // ユーザー情報が存在しない場合（未ログイン）は、デフォルトのログインと新規登録ボタンを表示
    headerButtonsContainer.innerHTML = `
      <a href="login.html" class="btn btn-outline-primary me-2">ログイン</a>
      <a href="login.html?tab=register" class="btn btn-primary">新規登録</a>
    `;
  }
}

/**
 * ログアウト処理を行う関数
 */
function logout() {
  // ローカルストレージからユーザー情報を削除
  localStorage.removeItem('userInfo');
  
  // ページをリロードしてUIを更新
  window.location.reload();
}
