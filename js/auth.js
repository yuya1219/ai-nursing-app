/**
 * AI看護記録アプリケーション - 認証スクリプト
 */

import { showTermsModal, showPrivacyModal } from './modalUtils.js';

// DOMが完全に読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
  // フォーム要素の取得
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginSpinner = document.getElementById('loginSpinner');
  const registerSpinner = document.getElementById('registerSpinner');
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const googleRegisterBtn = document.getElementById('googleRegisterBtn');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  
  // URLパラメータの取得（リダイレクト先など）
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = urlParams.get('redirect') || 'index.html';
  
  // タブパラメータの取得
  const tab = urlParams.get("tab");

  // 新規登録タブをアクティブにする
  if (tab === "register") {
    document.getElementById("register-tab").click();
  }

  // ログインフォームの送信処理
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      if (!loginForm.checkValidity()) {
        event.stopPropagation();
        loginForm.classList.add('was-validated');
        return;
      }
      
      // ログイン処理
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const rememberMe = document.getElementById('rememberMe').checked;
      
      // ログインボタンの状態を変更（ローディング表示）
      const submitButton = loginForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      loginSpinner.classList.remove('d-none');
      
      // ログイン処理の実行
      login(email, password, rememberMe);
    });
  }

  // パスワード表示切替
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('registerPassword');

  togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
  });
  
  // 新規登録フォームの送信処理
  if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // パスワード一致確認
      const passwordInput = document.getElementById('registerPassword');
      const confirmPasswordInput = document.getElementById('confirmPassword');
      const formText = passwordInput.closest('.mb-3').querySelector('.form-text'); // 説明テキスト
      const invalidFeedback = passwordInput.closest('.mb-3').querySelector('.invalid-feedback'); // エラーメッセージ

      // パスワードのバリデーションルール（8文字以上、英字、数字、記号を含む）
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~\-]).{8,}$/;
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (passwordPattern.test(password)) {
        document.getElementById('registerPassword').setCustomValidity(''); // 条件を満たしていたら何も表示しない
      } else {
        document.getElementById('registerPassword').setCustomValidity('条件を満たしていません'); // 条件を満たしていない場合はエラーメッセージを表示
      }
      
      if (password !== confirmPassword) {
        document.getElementById('confirmPassword').setCustomValidity('パスワードが一致しません');
      } else {
        document.getElementById('confirmPassword').setCustomValidity('');
      }
      
      if (!registerForm.checkValidity()) {
        event.stopPropagation();
        registerForm.classList.add('was-validated');
        return;
      }
      
      // 登録処理
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      
      // 登録ボタンの状態を変更（ローディング表示）
      const submitButton = registerForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      registerSpinner.classList.remove('d-none');
      
      // 登録処理の実行
      register(name, email, password);
    });
  }
  
  // Googleログインボタンのイベント処理
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', function() {
      googleAuth('login');
    });
  }
  
  // Google登録ボタンのイベント処理
  if (googleRegisterBtn) {
    googleRegisterBtn.addEventListener('click', function() {
      googleAuth('register');
    });
  }
  
  // パスワードを忘れたリンクのイベント処理
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(event) {
      event.preventDefault();
      showForgotPasswordModal();
    });
  }
  
  // 利用規約リンクのイベント処理
  if (termsLink) {
    termsLink.addEventListener('click', function(event) {
      event.preventDefault();
      showTermsModal();
    });
  }

  // プライバシーポリシーリンクのイベント処理
  if (privacyLink) {
    privacyLink.addEventListener('click', function (event) {
      event.preventDefault();
      showPrivacyModal();
    });
  }
  
  // ログイン状態の確認
  checkLoginStatus();
});

/**
 * ログイン処理を実行する関数
 * 
 * @param {string} email メールアドレス
 * @param {string} password パスワード
 * @param {boolean} rememberMe ログイン状態を保持するかどうか
 */
function login(email, password, rememberMe) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('ログイン処理:', { email, password, rememberMe });
  
  // 開発用のモック処理：2秒後にログイン成功とする
  setTimeout(function() {
    // ログイン成功時の処理
    
    
    // リダイレクト先のURLを取得
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect') || 'index.html';
    
    // リダイレクト
    // window.location.href = redirectUrl;
    
    // 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
    fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        action: 'loginUser',
        email: email,
        password: password,
        rememberMe: rememberMe
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // ログイン成功時の処理
          // ユーザー情報をローカルストレージに保存
          localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
        window.location.href = redirectUrl;
      } else {
        // ログイン失敗時の処理
        showLoginError(data.error);
        resetLoginForm();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showLoginError('通信エラーが発生しました。再度お試しください。');
      resetLoginForm();
    });
    
  }, 2000);
}

/**
 * 新規登録処理を実行する関数
 * 
 * @param {string} name 氏名
 * @param {string} email メールアドレス
 * @param {string} password パスワード
 */
function register(name, email, password) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('登録処理:', { name, email, password});
  
  // 開発用のモック処理：2秒後に登録成功とする
  setTimeout(function() {
    // 登録成功時の処理
    
    // ユーザー情報をローカルストレージに保存
    // localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    // リダイレクト先のURLを取得
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect') || 'index.html';
    
    // リダイレクト
    // window.location.href = redirectUrl;
    
    // 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
    fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        action: 'registerUser',
        name: name,
        email: email,
        password: password
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // 登録成功時の処理
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
        window.location.href = redirectUrl;
      } else {
        // 登録失敗時の処理
        showRegisterError(data.error);
        resetRegisterForm();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showRegisterError('通信エラーが発生しました。再度お試しください。');
      resetRegisterForm();
    });
  }, 2000);
}

/**
 * Google認証を実行する関数
 * 
 * @param {string} mode 'login'または'register'
 */
function googleAuth(mode) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('Google認証:', { mode });
  
  // 開発用のモック処理：Google認証は実装しない
  alert('Google認証は現在開発中です。');
  
  /* 実際のデプロイ時にはこの部分を実際のGoogle認証に置き換え
  // Google認証用のウィンドウを開く
  const authWindow = window.open(
    `${gasUrl}?action=googleAuth&mode=${mode}`,
    'googleAuth',
    'width=600,height=600'
  );
  
  // メッセージイベントのリスナーを設定
  window.addEventListener('message', function(event) {
    if (event.origin !== window.location.origin) return;
    
    if (event.data.success) {
      // 認証成功時の処理
      localStorage.setItem('userInfo', JSON.stringify(event.data.userInfo));
      window.location.href = redirectUrl;
    } else {
      // 認証失敗時の処理
      alert(event.data.error || '認証に失敗しました。');
    }
  });
  */
}

/**
 * ログイン状態を確認する関数
 */
function checkLoginStatus() {
  // ローカルストレージからユーザー情報を取得
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  // ログイン済みの場合
  if (userInfo && userInfo.userId) {
    // リダイレクト先のURLを取得
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    
    // リダイレクト先が指定されている場合はリダイレクト
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }
}

/**
 * ログインエラーを表示する関数
 * 
 * @param {string} errorMessage エラーメッセージ
 */
function showLoginError(errorMessage) {
  // エラーメッセージを表示
  const errorContainer = document.createElement('div');
  errorContainer.className = 'alert alert-danger mt-3';
  errorContainer.textContent = errorMessage;
  
  const form = document.getElementById('loginForm');
  form.parentNode.insertBefore(errorContainer, form.nextSibling);
  
  // 3秒後にエラーメッセージを消す
  setTimeout(function() {
    errorContainer.remove();
  }, 3000);
}

/**
 * 登録エラーを表示する関数
 * 
 * @param {string} errorMessage エラーメッセージ
 */
function showRegisterError(errorMessage) {
  // エラーメッセージを表示
  const errorContainer = document.createElement('div');
  errorContainer.className = 'alert alert-danger mt-3';
  errorContainer.textContent = errorMessage;
  
  const form = document.getElementById('registerForm');
  form.parentNode.insertBefore(errorContainer, form.nextSibling);
  
  // 5秒後にエラーメッセージを消す
  setTimeout(function() {
    errorContainer.remove();
  }, 5000);
}

/**
 * ログインフォームをリセットする関数
 */
function resetLoginForm() {
  const submitButton = document.querySelector('#loginForm button[type="submit"]');
  submitButton.disabled = false;
  document.getElementById('loginSpinner').classList.add('d-none');
}

/**
 * 登録フォームをリセットする関数
 */
function resetRegisterForm() {
  const submitButton = document.querySelector('#registerForm button[type="submit"]');
  submitButton.disabled = false;
  document.getElementById('registerSpinner').classList.add('d-none');
}

/**
 * パスワードを忘れたモーダルを表示する関数
 */
function showForgotPasswordModal() {
  // モーダルのHTMLを作成
  const modalHtml = `
    <div class="modal fade" id="forgotPasswordModal" tabindex="-1" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="forgotPasswordModalLabel">パスワードをリセット</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="forgotPasswordForm">
              <div class="mb-3">
                <label for="resetEmail" class="form-label">メールアドレス</label>
                <input type="email" class="form-control" id="resetEmail" required>
                <div class="form-text">パスワードリセットのリンクをメールで送信します。</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
            <button type="button" class="btn btn-primary" id="sendResetLinkBtn">リセットリンクを送信</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // モーダルをDOMに追加
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // モーダルを表示
  const modal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
  modal.show();
  
  // リセットリンク送信ボタンのイベント処理
  document.getElementById('sendResetLinkBtn').addEventListener('click', function() {
    const email = document.getElementById('resetEmail').value;
    if (email) {
      // パスワードリセットリンクの送信処理
      sendPasswordResetLink(email);
      modal.hide();
    }
  });
  
  // モーダルが閉じられたときの処理
  document.getElementById('forgotPasswordModal').addEventListener('hidden.bs.modal', function() {
    // モーダルをDOMから削除
    this.remove();
  });
}

/**
 * パスワードリセットリンクを送信する関数
 * 
 * @param {string} email メールアドレス
 */
function sendPasswordResetLink(email) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('パスワードリセットリンク送信:', { email });
  
  // 開発用のモック処理：送信成功メッセージを表示
  alert(`${email}宛にパスワードリセットのリンクを送信しました。メールをご確認ください。`);
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'resetPassword',
      email: email
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // 送信成功時の処理
      alert(`${email}宛にパスワードリセットのリンクを送信しました。メールをご確認ください。`);
    } else {
      // 送信失敗時の処理
      alert(data.error || 'パスワードリセットリンクの送信に失敗しました。');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('通信エラーが発生しました。再度お試しください。');
  });
  */
}
