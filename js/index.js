/**
 * AI看護記録アプリケーション - インデックスページスクリプト
 */

// DOMが完全に読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
  const userInfoJson = localStorage.getItem('userInfo');
  const expiryTime = localStorage.getItem('userInfoExpiry');

  const headerContainer = document.querySelector("#index_header");

  // ユーザ情報作成
  if (!userInfoJson) {
    generateAnonUserId().then(tempUserId => {
      localStorage.setItem('userInfo', JSON.stringify({
        'userId': tempUserId,
        'name': '',
        'email': '',
        'role': 'user',
        'subscriptionPlan': 'free',
        'usageLimit': {
          dailyLimit: 3,
          remainingToday: 3
          },
        'usageCount': {
           "assessment": 0, "relationshipDiagram": 0, "nursingPlan": 0 
          },
        'lastResetDate': new Date().toISOString().slice(0, 10)
      }));

    })
  };

  // 日付変更時、実行回数制限リセット
  resetDailyLimitIfNeeded();

  if (headerContainer) {
    // `index_header.html` を読み込んで `#index_header` に挿入
    fetch("index_header.html")
      .then(response => response.ok ? response.text() : Promise.reject(`HTTP error! Status: ${response.status}`))
      .then(data => {
        headerContainer.innerHTML = data;
        updateUIBasedOnLoginState(); // ← ヘッダーが読み込まれてから実行
      })
      .catch(error => console.error("ヘッダーの読み込みに失敗しました:", error));
  }

  // 前回ログインから24時間以上経っていたら、ローカルストレージ情報を削除（”ログイン状態を保持”チェック無の場合）
  if (userInfoJson) {
    if (expiryTime && new Date().getTime() > expiryTime) {
      // 期限切れなので削除
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userInfoExpiry');
    }
  }

  
  // `footer.html` を読み込んで `#footer` に挿入
  const footerContainer = document.querySelector("#footer");

  fetch("footer.html")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      document.querySelector("#footer").innerHTML = data;
    })
    .catch(error => console.error("フッターの読み込みに失敗しました:", error));
});

/**
 * ログイン状態に応じてUIを更新する関数
 */
function updateUIBasedOnLoginState() {
  // ローカルストレージからユーザー情報を取得
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  // ヘッダーのボタン表示エリアを取得
  const headerButtonsContainer = document.querySelector('header .d-flex');

  if (!headerButtonsContainer) {
    console.warn("ヘッダーのボタンエリアが見つかりません。");
    return;
  }
  
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

/**
 * ユーザーID作成処理
 */
async function generateAnonUserId() {
  const ip = await getClientIp();
  const userAgent = getUserAgent();
  const raw = ip + userAgent;

  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// IPアドレス取得
async function getClientIp() {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}

// ブラウザ情報（User-Agent）取得
function getUserAgent() {
  return navigator.userAgent;
}

// 回数制限は午前0時にリセット（＝ dailyLimit に戻す）
function resetDailyLimitIfNeeded() {
  const userInfoStr = localStorage.getItem('userInfo');
  if (!userInfoStr) return;

  const userInfo = JSON.parse(userInfoStr);
  const today = new Date().toISOString().slice(0, 10); // 例: '2025-04-12'

  // 初回または日付が変わっていればリセット
  if (userInfo.lastResetDate !== today) {
    if (userInfo.usageLimit && typeof userInfo.usageLimit.dailyLimit === 'number') {
      userInfo.usageLimit.remainingToday = userInfo.usageLimit.dailyLimit;
      userInfo.lastResetDate = today;

      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      console.log('usageLimit がリセットされました');
    }
  }
}
