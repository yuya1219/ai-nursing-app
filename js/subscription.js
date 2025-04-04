/**
 * AI看護記録アプリケーション - サブスクリプションスクリプト
 */

// Stripeの公開キー（実際のデプロイ時には正しいキーに置き換え）
const stripePublicKey = 'pk_test_51NxSaMPLEkEyPuBLiCkEy00000000000';

// Stripeオブジェクトの初期化
let stripe;

// DOMが完全に読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
  const headerContainer = document.querySelector("#header");

  if (headerContainer) {
    // `header.html` を読み込んで `#header` に挿入
    fetch("header.html")
      .then(response => response.ok ? response.text() : Promise.reject(`HTTP error! Status: ${response.status}`))
      .then(data => {
        headerContainer.innerHTML = data;
        updateUIBasedOnLoginState(); // ← ヘッダーが読み込まれてから実行
      })
      .catch(error => console.error("ヘッダーの読み込みに失敗しました:", error));
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

  // Stripeの初期化
  initStripe();
  
  // ログイン状態の確認
  checkLoginStatus();
  
  // イベントリスナーの設定
  setupEventListeners();
});

/**
 * Stripeを初期化する関数
 */
function initStripe() {
  try {
    stripe = Stripe(stripePublicKey);
    console.log('Stripe initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
  }
}

/**
 * ログイン状態を確認する関数
 */
function checkLoginStatus() {
  // ローカルストレージからユーザー情報を取得
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  if (userInfo && userInfo.userId) {
    // ログイン済みの場合
    // document.getElementById('authButtons').classList.add('d-none');
    // document.getElementById('userMenu').classList.remove('d-none');
    // document.getElementById('userName').textContent = userInfo.name || 'ユーザー';
    
    // 現在のプラン情報を表示
    document.getElementById('currentPlanCard').classList.remove('d-none');
    
    // プラン情報を設定
    updatePlanInfo(userInfo);
    
    // プランボタンの表示を更新
    updatePlanButtons(userInfo.subscriptionLevel);
  } else {
    // 未ログインの場合
    // document.getElementById('authButtons').classList.remove('d-none');
    // document.getElementById('userMenu').classList.add('d-none');
    document.getElementById('currentPlanCard').classList.add('d-none');
    
    // 無料プランボタンを「ログインして始める」に変更
    const freePlanBtn = document.querySelector('.free-plan-btn');
    if (freePlanBtn) {
      freePlanBtn.textContent = 'ログインして始める';
      freePlanBtn.addEventListener('click', function() {
        window.location.href = 'login.html';
      });
    }
    
    // 有料プランボタンを登録画面に設定
    const premiumPlanBtn = document.getElementById('premiumPlanBtn');
    if (premiumPlanBtn) {
      premiumPlanBtn.addEventListener('click', function() {
        window.location.href = 'register.html?plan=premium';
      });
    }
    
    const professionalPlanBtn = document.getElementById('professionalPlanBtn');
    if (professionalPlanBtn) {
      professionalPlanBtn.addEventListener('click', function() {
        window.location.href = 'register.html?plan=professional';
      });
    }
  }
}

/**
 * プラン情報を更新する関数
 * 
 * @param {Object} userInfo ユーザー情報
 */
function updatePlanInfo(userInfo) {
  // プラン名の表示
  let planName = '無料プラン';
  if (userInfo.subscriptionLevel === 'premium') {
    planName = 'プレミアムプラン';
  } else if (userInfo.subscriptionLevel === 'professional') {
    planName = 'プロフェッショナルプラン';
  }
  document.getElementById('currentPlanName').textContent = planName;
  
  // 次回請求日の表示（有料プランの場合のみ）
  if (userInfo.subscriptionLevel !== 'free' && userInfo.nextBillingDate) {
    document.getElementById('nextBillingDate').textContent = userInfo.nextBillingDate;
  } else {
    document.getElementById('nextBillingDate').textContent = '-';
  }
  
  // 残り利用回数の表示
  if (userInfo.usageLimit && userInfo.usageLimit.remainingToday !== undefined) {
    document.getElementById('remainingUsage').textContent = userInfo.usageLimit.remainingToday;
  } else {
    // 無制限の場合
    if (userInfo.subscriptionLevel === 'professional') {
      document.getElementById('remainingUsage').textContent = '無制限';
    } else {
      document.getElementById('remainingUsage').textContent = '0';
    }
  }
}

/**
 * プランボタンの表示を更新する関数
 * 
 * @param {string} currentPlan 現在のプラン
 */
function updatePlanButtons(currentPlan) {
  // 無料プランボタン
  const freePlanBtn = document.querySelector('.free-plan-btn');
  
  // プレミアムプランボタン
  const premiumPlanBtn = document.getElementById('premiumPlanBtn');
  
  // プロフェッショナルプランボタン
  const professionalPlanBtn = document.getElementById('professionalPlanBtn');
  
  if (currentPlan === 'free') {
    // 無料プランの場合
    freePlanBtn.textContent = '現在のプラン';
    freePlanBtn.disabled = true;
    
    premiumPlanBtn.textContent = 'アップグレード';
    premiumPlanBtn.addEventListener('click', function() {
      subscribeToPlan('premium');
    });
    
    professionalPlanBtn.textContent = 'アップグレード';
    professionalPlanBtn.addEventListener('click', function() {
      subscribeToPlan('professional');
    });
  } else if (currentPlan === 'premium') {
    // プレミアムプランの場合
    freePlanBtn.textContent = 'ダウングレード';
    freePlanBtn.addEventListener('click', function() {
      downgradeToFreePlan();
    });
    
    premiumPlanBtn.textContent = '現在のプラン';
    premiumPlanBtn.disabled = true;
    
    professionalPlanBtn.textContent = 'アップグレード';
    professionalPlanBtn.addEventListener('click', function() {
      subscribeToPlan('professional');
    });
  } else if (currentPlan === 'professional') {
    // プロフェッショナルプランの場合
    freePlanBtn.textContent = 'ダウングレード';
    freePlanBtn.addEventListener('click', function() {
      downgradeToFreePlan();
    });
    
    premiumPlanBtn.textContent = 'ダウングレード';
    premiumPlanBtn.addEventListener('click', function() {
      subscribeToPlan('premium');
    });
    
    professionalPlanBtn.textContent = '現在のプラン';
    professionalPlanBtn.disabled = true;
  }
}

/**
 * イベントリスナーを設定する関数
 */
function setupEventListeners() {
  // ログアウトボタンのイベントリスナー
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', function(event) {
      event.preventDefault();
      logout();
    });
  }
  
  // プラン管理ボタンのイベントリスナー
  const managePlanButton = document.getElementById('managePlanButton');
  if (managePlanButton) {
    managePlanButton.addEventListener('click', function() {
      showPlanManagementModal();
    });
  }
}

/**
 * プランに登録する関数
 * 
 * @param {string} planId プランID
 */
function subscribeToPlan(planId) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // ローカルストレージからユーザー情報を取得
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  if (!userInfo || !userInfo.userId) {
    // 未ログインの場合はログインページにリダイレクト
    window.location.href = 'login.html?redirect=subscription.html';
    return;
  }
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('プラン登録:', { planId, userId: userInfo.userId });
  
  // 支払い情報入力モーダルを表示
  showPaymentModal(planId);
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  // ローディング表示
  showLoading('処理中...');
  
  // Stripe Checkout Sessionの作成をリクエスト
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'createCheckoutSession',
      userId: userInfo.userId,
      planId: planId
    })
  })
  .then(response => response.json())
  .then(data => {
    hideLoading();
    
    if (data.success && data.sessionId) {
      // Stripe Checkoutにリダイレクト
      return stripe.redirectToCheckout({ sessionId: data.sessionId });
    } else {
      console.error('Error:', data.error);
      showError('セッションの作成に失敗しました。再度お試しください。');
    }
  })
  .then(result => {
    if (result.error) {
      console.error('Error:', result.error);
      showError(result.error.message);
    }
  })
  .catch(error => {
    hideLoading();
    console.error('Error:', error);
    showError('通信エラーが発生しました。再度お試しください。');
  });
  */
}

/**
 * 無料プランにダウングレードする関数
 */
function downgradeToFreePlan() {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // ローカルストレージからユーザー情報を取得
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  if (!userInfo || !userInfo.userId) {
    // 未ログインの場合はログインページにリダイレクト
    window.location.href = 'login.html?redirect=subscription.html';
    return;
  }
  
  // 確認ダイアログを表示
  if (confirm('無料プランにダウングレードしますか？現在の課金期間終了後に適用されます。')) {
    // 開発用のモック処理（実際のデプロイ時には削除）
    console.log('無料プランにダウングレード:', { userId: userInfo.userId });
    
    // 成功メッセージを表示
    alert('次回の請求日以降、無料プランに変更されます。');
    
    /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
    // ローディング表示
    showLoading('処理中...');
    
    // サブスクリプションのキャンセルをリクエスト
    fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'cancelSubscription',
        userId: userInfo.userId
      })
    })
    .then(response => response.json())
    .then(data => {
      hideLoading();
      
      if (data.success) {
        alert('次回の請求日以降、無料プランに変更されます。');
        
        // ユーザー情報を更新
        userInfo.subscriptionStatus = 'canceled';
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // 画面を更新
        location.reload();
      } else {
        console.error('Error:', data.error);
        showError('サブスクリプションのキャンセルに失敗しました。再度お試しください。');
      }
    })
    .catch(error => {
      hideLoading();
      console.error('Error:', error);
      showError('通信エラーが発生しました。再度お試しください。');
    });
    */
  }
}

/**
 * 支払い情報入力モーダルを表示する関数
 * 
 * @param {string} planId プランID
 */
function showPaymentModal(planId) {
  // プラン情報
  const planInfo = {
    premium: {
      name: 'プレミアムプラン',
      price: 980,
      features: [
        '1日20回までの利用',
        'アセスメント生成（高度な分析）',
        '関連図の閲覧',
        '看護計画の完全表示',
        '履歴保存（最大50件）',
        '広告表示なし'
      ]
    },
    professional: {
      name: 'プロフェッショナルプラン',
      price: 2980,
      features: [
        '無制限の利用',
        'アセスメント生成（最高精度）',
        '関連図の閲覧・カスタマイズ',
        '看護計画の完全表示・編集',
        '履歴保存（無制限）',
        '広告表示なし'
      ]
    }
  };
  
  const plan = planInfo[planId];
  
  // モーダルのHTMLを作成
  const modalHtml = `
    <div class="modal fade" id="paymentModal" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="paymentModalLabel">${plan.name}に登録</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-4">
              <div class="col-md-6">
                <h6 class="mb-3">プラン詳細</h6>
                <p class="mb-2">月額料金: ¥${plan.price.toLocaleString()}</p>
                <p class="mb-3">請求サイクル: 毎月</p>
                <ul class="list-unstyled">
                  ${plan.features.map(feature => `<li class="mb-2"><i class="fas fa-check text-success me-2"></i>${feature}</li>`).join('')}
                </ul>
              </div>
              <div class="col-md-6">
                <h6 class="mb-3">お支払い情報</h6>
                <form id="paymentForm">
                  <div class="mb-3">
                    <label for="cardholderName" class="form-label">カード名義</label>
                    <input type="text" class="form-control" id="cardholderName" placeholder="TARO YAMADA" required>
                  </div>
                  <div class="mb-3">
                    <label for="cardElement" class="form-label">カード情報</label>
                    <div id="cardElement" class="form-control" style="height: 40px; padding-top: 10px;"></div>
                    <div id="cardErrors" class="text-danger mt-1" role="alert"></div>
                  </div>
                </form>
              </div>
            </div>
            <div class="alert alert-info">
              <i class="fas fa-info-circle me-2"></i>
              登録後、すぐにプランが有効になります。いつでもキャンセルできます。
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
            <button type="button" class="btn btn-primary" id="submitPaymentBtn">
              <span id="paymentBtnText">¥${plan.price.toLocaleString()}で登録</span>
              <span id="paymentSpinner" class="spinner-border spinner-border-sm ms-2 d-none" role="status"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // モーダルをDOMに追加
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // モーダルを表示
  const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
  modal.show();
  
  // Stripeカード要素の作成
  const elements = stripe.elements();
  const style = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };
  
  const cardElement = elements.create('card', { style: style });
  cardElement.mount('#cardElement');
  
  // カード入力エラーのハンドリング
  cardElement.on('change', function(event) {
    const displayError = document.getElementById('cardErrors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });
  
  // 支払い送信ボタンのイベント処理
  document.getElementById('submitPaymentBtn').addEventListener('click', function() {
    // カード名義の取得
    const cardholderName = document.getElementById('cardholderName').value;
    
    if (!cardholderName) {
      document.getElementById('cardErrors').textContent = 'カード名義を入力してください。';
      return;
    }
    
    // ボタンの状態を変更（ローディング表示）
    this.disabled = true;
    document.getElementById('paymentBtnText').textContent = '処理中...';
    document.getElementById('paymentSpinner').classList.remove('d-none');
    
    // 開発用のモック処理（実際のデプロイ時には削除）
    setTimeout(function() {
      // 支払い成功時の処理
      modal.hide();
      
      // ユーザー情報を更新
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      userInfo.subscriptionLevel = planId;
      userInfo.nextBillingDate = getNextMonthDate();
      
      if (planId === 'premium') {
        userInfo.usageLimit = {
          dailyLimit: 20,
          remainingToday: 20
        };
      } else if (planId === 'professional') {
        userInfo.usageLimit = {
          dailyLimit: 999999,
          remainingToday: 999999
        };
      }
      
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      // 成功メッセージを表示
      alert(`${plan.name}への登録が完了しました。`);
      
      // 画面を更新
      location.reload();
    }, 2000);
    
    /* 実際のデプロイ時にはこの部分を実際のStripe決済処理に置き換え
    // 実際のデプロイ時にはGASのWebアプリURLを設定
    const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
    
    // ローカルストレージからユーザー情報を取得
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    // 支払い情報の取得
    stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: cardholderName
      }
    })
    .then(function(result) {
      if (result.error) {
        // エラー表示
        document.getElementById('cardErrors').textContent = result.error.message;
        
        // ボタンの状態を元に戻す
        document.getElementById('submitPaymentBtn').disabled = false;
        document.getElementById('paymentBtnText').textContent = `¥${plan.price.toLocaleString()}で登録`;
        document.getElementById('paymentSpinner').classList.add('d-none');
      } else {
        // サーバーに支払い情報を送信
        fetch(gasUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'createSubscription',
            userId: userInfo.userId,
            planId: planId,
            paymentMethodId: result.paymentMethod.id
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // 支払い成功時の処理
            modal.hide();
            
            // ユーザー情報を更新
            userInfo.subscriptionLevel = planId;
            userInfo.nextBillingDate = data.nextBillingDate;
            userInfo.usageLimit = data.usageLimit;
            
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            
            // 成功メッセージを表示
            alert(`${plan.name}への登録が完了しました。`);

            // ユーザー情報を更新
            updateUserSubscriptionStatus(plan.id);

            // マイページに遷移する前に少し待機
            setTimeout(() => {
              // 購入完了ページに遷移
              window.location.href = 'subscription-success.html?plan=' + encodeURIComponent(plan.id);
            }, 1500);
            */
    })
  };

/**
 * ユーザーのサブスクリプション状態を更新する
 * @param {string} planId - 登録したプランのID
 */
function updateUserSubscriptionStatus(planId) {
  // ローディング表示
  showLoading();
  
  // ユーザーIDを取得
  const userId = getUserId();
  
  // APIリクエスト
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'updateUserSubscription',
      userId: userId,
      planId: planId
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('ネットワークエラーが発生しました');
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      // ローカルストレージのユーザー情報を更新
      const user = JSON.parse(localStorage.getItem('user'));
      user.subscription = {
        planId: planId,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: data.subscriptionEndDate
      };
      localStorage.setItem('user', JSON.stringify(user));
      
      // ローディング非表示
      hideLoading();
      
      console.log('サブスクリプション状態が更新されました');
    } else {
      // エラーメッセージを表示
      hideLoading();
      showAlert(data.error || 'サブスクリプション状態の更新に失敗しました', 'danger');
    }
  })
  .catch(error => {
    console.error('サブスクリプション更新エラー:', error);
    hideLoading();
    showAlert('サブスクリプション状態の更新中にエラーが発生しました: ' + error.message, 'danger');
  });
}

/**
 * サブスクリプションをキャンセルする
 */
function cancelSubscription() {
  // 確認ダイアログを表示
  if (!confirm('サブスクリプションをキャンセルしますか？\n\n注意: キャンセル後も現在の請求期間の終了まではサービスを利用できます。')) {
    return;
  }
  
  // ローディング表示
  showLoading();
  
  // ユーザーIDを取得
  const userId = getUserId();
  
  // APIリクエスト
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'cancelSubscription',
      userId: userId
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('ネットワークエラーが発生しました');
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      // ローカルストレージのユーザー情報を更新
      const user = JSON.parse(localStorage.getItem('user'));
      user.subscription.status = 'canceled';
      user.subscription.cancelDate = new Date().toISOString();
      localStorage.setItem('user', JSON.stringify(user));
      
      // ローディング非表示
      hideLoading();
      
      // 成功メッセージを表示
      showAlert('サブスクリプションのキャンセルが完了しました。現在の請求期間の終了まではサービスを利用できます。', 'success');
      
      // サブスクリプション情報を更新
      updateSubscriptionInfo();
    } else {
      // エラーメッセージを表示
      hideLoading();
      showAlert(data.error || 'サブスクリプションのキャンセルに失敗しました', 'danger');
    }
  })
  .catch(error => {
    console.error('サブスクリプションキャンセルエラー:', error);
    hideLoading();
    showAlert('サブスクリプションのキャンセル中にエラーが発生しました: ' + error.message, 'danger');
  });
}

/**
 * サブスクリプションを再開する
 */
function reactivateSubscription() {
  // 確認ダイアログを表示
  if (!confirm('サブスクリプションを再開しますか？')) {
    return;
  }
  
  // ローディング表示
  showLoading();
  
  // ユーザーIDを取得
  const userId = getUserId();
  
  // APIリクエスト
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'reactivateSubscription',
      userId: userId
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('ネットワークエラーが発生しました');
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      // ローカルストレージのユーザー情報を更新
      const user = JSON.parse(localStorage.getItem('user'));
      user.subscription.status = 'active';
      delete user.subscription.cancelDate;
      localStorage.setItem('user', JSON.stringify(user));
      
      // ローディング非表示
      hideLoading();
      
      // 成功メッセージを表示
      showAlert('サブスクリプションの再開が完了しました。', 'success');
      
      // サブスクリプション情報を更新
      updateSubscriptionInfo();
    } else {
      // エラーメッセージを表示
      hideLoading();
      showAlert(data.error || 'サブスクリプションの再開に失敗しました', 'danger');
    }
  })
  .catch(error => {
    console.error('サブスクリプション再開エラー:', error);
    hideLoading();
    showAlert('サブスクリプションの再開中にエラーが発生しました: ' + error.message, 'danger');
  });
}

/**
 * サブスクリプションをアップグレードする
 * @param {string} newPlanId - 新しいプランのID
 */
function upgradeSubscription(newPlanId) {
  // 確認ダイアログを表示
  if (!confirm('サブスクリプションをアップグレードしますか？\n\n注意: アップグレード後、すぐに新しいプランが適用されます。')) {
    return;
  }
  
  // ローディング表示
  showLoading();
  
  // ユーザーIDを取得
  const userId = getUserId();
  
  // APIリクエスト
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'upgradeSubscription',
      userId: userId,
      newPlanId: newPlanId
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('ネットワークエラーが発生しました');
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      // ローカルストレージのユーザー情報を更新
      const user = JSON.parse(localStorage.getItem('user'));
      user.subscription.planId = newPlanId;
      user.subscription.status = 'active';
      user.subscription.upgradeDate = new Date().toISOString();
      localStorage.setItem('user', JSON.stringify(user));
      
      // ローディング非表示
      hideLoading();
      
      // 成功メッセージを表示
      showAlert('サブスクリプションのアップグレードが完了しました。', 'success');
      
      // サブスクリプション情報を更新
      updateSubscriptionInfo();
    } else {
      // エラーメッセージを表示
      hideLoading();
      showAlert(data.error || 'サブスクリプションのアップグレードに失敗しました', 'danger');
    }
  })
  .catch(error => {
    console.error('サブスクリプションアップグレードエラー:', error);
    hideLoading();
    showAlert('サブスクリプションのアップグレード中にエラーが発生しました: ' + error.message, 'danger');
  });
}

/**
 * 支払い方法を更新する
 */
function updatePaymentMethod() {
  // Stripeの支払い方法更新セッションを作成
  const userId = getUserId();
  
  // ローディング表示
  showLoading();
  
  // APIリクエスト
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'createUpdatePaymentSession',
      userId: userId
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('ネットワークエラーが発生しました');
    }
    return response.json();
  })
  .then(data => {
    if (data.success && data.sessionId) {
      // ローディング非表示
      hideLoading();
      
      // Stripeの支払い方法更新ページにリダイレクト
      stripe.redirectToCheckout({
        sessionId: data.sessionId
      }).then(function (result) {
        if (result.error) {
          showAlert(result.error.message, 'danger');
        }
      });
    } else {
      // エラーメッセージを表示
      hideLoading();
      showAlert(data.error || '支払い方法の更新セッションの作成に失敗しました', 'danger');
    }
  })
  .catch(error => {
    console.error('支払い方法更新エラー:', error);
    hideLoading();
    showAlert('支払い方法の更新セッションの作成中にエラーが発生しました: ' + error.message, 'danger');
  });
}

/**
 * 請求履歴を取得して表示する
 */
function loadBillingHistory() {
  // ローディング表示
  const billingHistoryContainer = document.getElementById('billingHistoryContainer');
  billingHistoryContainer.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">読み込み中...</span></div></div>';
  
  // ユーザーIDを取得
  const userId = getUserId();
  
  // APIリクエスト
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'getBillingHistory',
      userId: userId
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('ネットワークエラーが発生しました');
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      // 請求履歴を表示
      displayBillingHistory(data.billingHistory);
    } else {
      // エラーメッセージを表示
      billingHistoryContainer.innerHTML = `<div class="alert alert-danger">${data.error || '請求履歴の取得に失敗しました'}</div>`;
    }
  })
  .catch(error => {
    console.error('請求履歴取得エラー:', error);
    billingHistoryContainer.innerHTML = `<div class="alert alert-danger">請求履歴の取得中にエラーが発生しました: ${error.message}</div>`;
  });
}

/**
 * 請求履歴を表示する
 * @param {Array} billingHistory - 請求履歴データ
 */
function displayBillingHistory(billingHistory) {
  const billingHistoryContainer = document.getElementById('billingHistoryContainer');
  
  if (billingHistory.length === 0) {
    billingHistoryContainer.innerHTML = '<div class="alert alert-info">請求履歴はありません。</div>';
    return;
  }
  
  let html = `
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>日付</th>
            <th>プラン</th>
            <th>金額</th>
            <th>ステータス</th>
            <th>請求書</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  billingHistory.forEach(item => {
    const date = new Date(item.date).toLocaleDateString('ja-JP');
    const status = getStatusBadge(item.status);
    
    html += `
      <tr>
        <td>${date}</td>
        <td>${item.planName}</td>
        <td>¥${item.amount.toLocaleString()}</td>
        <td>${status}</td>
        <td>
          ${item.invoiceUrl ? `<a href="${item.invoiceUrl}" target="_blank" class="btn btn-sm btn-outline-primary">請求書</a>` : '-'}
        </td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  billingHistoryContainer.innerHTML = html;
}

/**
 * 請求ステータスに応じたバッジを取得する
 * @param {string} status - 請求ステータス
 * @return {string} HTMLバッジ
 */
function getStatusBadge(status) {
  switch (status) {
    case 'paid':
      return '<span class="badge bg-success">支払い済み</span>';
    case 'unpaid':
      return '<span class="badge bg-warning">未払い</span>';
    case 'failed':
      return '<span class="badge bg-danger">失敗</span>';
    default:
      return '<span class="badge bg-secondary">不明</span>';
  }
}

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
