/**
 * AI看護記録アプリケーション - 新規登録スクリプト
 */

document.addEventListener('DOMContentLoaded', function() {
    // ログイン状態に応じたUIの更新
    updateUIBasedOnLoginState();

    // URLパラメータからプラン情報を取得
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');

    if (planParam) {
        const planInfoElement = document.getElementById('selectedPlanInfo');
    const planNameElement = document.getElementById('planName');

    if (planParam === 'premium') {
        planNameElement.textContent = 'プレミアムプラン';
    planInfoElement.classList.remove('d-none');
        } else if (planParam === 'professional') {
        planNameElement.textContent = 'プロフェッショナルプラン';
    planInfoElement.classList.remove('d-none');
        }
        }

    // パスワード表示切替
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('registerPassword');

    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
        });

    // フォームバリデーション
    const form = document.getElementById('registerForm');
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');

    form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
        event.preventDefault();
    event.stopPropagation();
        }

    // パスワード一致チェック
    if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity('パスワードが一致しません');
        } else {
        confirmPassword.setCustomValidity('');
        }

    form.classList.add('was-validated');

    // 実際の送信処理（デモ用）
    if (form.checkValidity()) {
        event.preventDefault();

    // ローディングスピナー表示
    const spinner = document.getElementById('registerSpinner');
    const submitButton = form.querySelector('button[type="submit"]');

    spinner.classList.remove('d-none');
    submitButton.disabled = true;

    // 送信処理をシミュレート（実際はAPIリクエストなど）
    setTimeout(function() {
        // 登録成功後の処理
        window.location.href = 'index.html';
            }, 2000);
        }
        });

    // Googleログインボタン
    document.getElementById('googleRegisterBtn').addEventListener('click', function() {
        // Google認証処理（実装は省略）
        alert('Google認証は実装されていません（デモ用）');
        });
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
        document.getElementById('logoutButton').addEventListener('click', function (e) {
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
