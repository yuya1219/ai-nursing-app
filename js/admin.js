/**
 * AI看護記録アプリケーション - 管理者ページスクリプト
 */

// DOMが完全に読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
  // 管理者権限チェック
  checkAdminPermission();
  
  // ダッシュボードデータの読み込み
  loadDashboardData();
  
  // ユーザーデータの読み込み
  loadUserData();
  
  // サブスクリプションデータの読み込み
  loadSubscriptionData();
  
  // 統計チャートの初期化
  initCharts();
  
  // システム設定の読み込み
  loadSystemSettings();
  
  // イベントリスナーの設定
  setupEventListeners();
});

/**
 * 管理者権限をチェックする関数
 */
function checkAdminPermission() {
  // ローカルストレージからユーザー情報を取得
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  // 管理者名を表示
  if (userInfo && userInfo.name) {
    document.getElementById('adminName').textContent = userInfo.name;
  }
  
  // 管理者権限がない場合はリダイレクト
//   if (!userInfo || userInfo.role !== 'admin') {
//     window.location.href = 'login.html?redirect=admin.html';
//     return;
//   }
}

/**
 * ダッシュボードデータを読み込む関数
 */
function loadDashboardData() {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/YOUR_DEPLOYED_GAS_WEB_APP_URL/exec';
  
  // 開発用のモックデータ（実際のデプロイ時には削除）
  const mockDashboardData = {
    totalUsers: 256,
    premiumUsers: 78,
    todayGenerations: 124,
    monthlyRevenue: 156800
  };
  
  // ダッシュボードデータを表示
  document.getElementById('totalUsers').textContent = mockDashboardData.totalUsers;
  document.getElementById('premiumUsers').textContent = mockDashboardData.premiumUsers;
  document.getElementById('todayGenerations').textContent = mockDashboardData.todayGenerations;
  document.getElementById('monthlyRevenue').textContent = `¥${mockDashboardData.monthlyRevenue.toLocaleString()}`;
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getDashboardData'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      document.getElementById('totalUsers').textContent = data.totalUsers;
      document.getElementById('premiumUsers').textContent = data.premiumUsers;
      document.getElementById('todayGenerations').textContent = data.todayGenerations;
      document.getElementById('monthlyRevenue').textContent = `¥${data.monthlyRevenue.toLocaleString()}`;
    } else {
      console.error('Error:', data.error);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
  */
}

/**
 * ユーザーデータを読み込む関数
 */
function loadUserData() {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモックデータ（実際のデプロイ時には削除）
  const mockUserData = [
    {
      id: 'user001',
      name: '山田 太郎',
      email: 'yamada@example.com',
      role: 'user',
      plan: 'premium',
      registrationDate: '2025-01-15',
      status: 'active'
    },
    {
      id: 'user002',
      name: '佐藤 花子',
      email: 'sato@example.com',
      role: 'user',
      plan: 'free',
      registrationDate: '2025-02-20',
      status: 'active'
    },
    {
      id: 'user003',
      name: '鈴木 一郎',
      email: 'suzuki@example.com',
      role: 'admin',
      plan: 'professional',
      registrationDate: '2024-12-05',
      status: 'active'
    },
    {
      id: 'user004',
      name: '田中 次郎',
      email: 'tanaka@example.com',
      role: 'user',
      plan: 'premium',
      registrationDate: '2025-03-10',
      status: 'suspended'
    },
    {
      id: 'user005',
      name: '伊藤 三郎',
      email: 'ito@example.com',
      role: 'user',
      plan: 'free',
      registrationDate: '2025-03-15',
      status: 'active'
    }
  ];
  
  // ユーザーテーブルを生成
  const userTableBody = document.getElementById('userTableBody');
  userTableBody.innerHTML = '';
  
  mockUserData.forEach(user => {
    const row = document.createElement('tr');
    
    // ステータスに応じたバッジクラスを設定
    let statusBadgeClass = 'bg-success';
    if (user.status === 'suspended') {
      statusBadgeClass = 'bg-danger';
    } else if (user.status === 'pending') {
      statusBadgeClass = 'bg-warning';
    }
    
    // プランに応じたバッジクラスを設定
    let planBadgeClass = 'bg-secondary';
    if (user.plan === 'premium') {
      planBadgeClass = 'bg-primary';
    } else if (user.plan === 'professional') {
      planBadgeClass = 'bg-info';
    }
    
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td><span class="badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}">${user.role}</span></td>
      <td><span class="badge ${planBadgeClass}">${user.plan}</span></td>
      <td>${user.registrationDate}</td>
      <td><span class="badge ${statusBadgeClass}">${user.status}</span></td>
      <td>
        <div class="btn-group btn-group-sm">
          <button type="button" class="btn btn-outline-primary edit-user-btn" data-user-id="${user.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button type="button" class="btn btn-outline-danger delete-user-btn" data-user-id="${user.id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    `;
    
    userTableBody.appendChild(row);
  });
  
  // ユーザー編集ボタンのイベントリスナーを設定
  document.querySelectorAll('.edit-user-btn').forEach(button => {
    button.addEventListener('click', function() {
      const userId = this.getAttribute('data-user-id');
      editUser(userId);
    });
  });
  
  // ユーザー削除ボタンのイベントリスナーを設定
  document.querySelectorAll('.delete-user-btn').forEach(button => {
    button.addEventListener('click', function() {
      const userId = this.getAttribute('data-user-id');
      deleteUser(userId);
    });
  });
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getUserData'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // ユーザーテーブルを生成
      const userTableBody = document.getElementById('userTableBody');
      userTableBody.innerHTML = '';
      
      data.users.forEach(user => {
        // 上記と同様の処理
      });
    } else {
      console.error('Error:', data.error);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
  */
}

/**
 * サブスクリプションデータを読み込む関数
 */
function loadSubscriptionData() {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモックデータ（実際のデプロイ時には削除）
  const mockSubscriptionData = [
    {
      userId: 'user001',
      userName: '山田 太郎',
      plan: 'premium',
      startDate: '2025-01-15',
      nextBillingDate: '2025-04-15',
      amount: 980,
      status: 'active'
    },
    {
      userId: 'user003',
      userName: '鈴木 一郎',
      plan: 'professional',
      startDate: '2024-12-05',
      nextBillingDate: '2025-04-05',
      amount: 2980,
      status: 'active'
    },
    {
      userId: 'user004',
      userName: '田中 次郎',
      plan: 'premium',
      startDate: '2025-03-10',
      nextBillingDate: '2025-04-10',
      amount: 980,
      status: 'canceled'
    }
  ];
  
  // サブスクリプションテーブルを生成
  const subscriptionTableBody = document.getElementById('subscriptionTableBody');
  subscriptionTableBody.innerHTML = '';
  
  mockSubscriptionData.forEach(subscription => {
    const row = document.createElement('tr');
    
    // ステータスに応じたバッジクラスを設定
    let statusBadgeClass = 'bg-success';
    if (subscription.status === 'canceled') {
      statusBadgeClass = 'bg-danger';
    } else if (subscription.status === 'past_due') {
      statusBadgeClass = 'bg-warning';
    }
    
    // プランに応じたバッジクラスを設定
    let planBadgeClass = 'bg-secondary';
    if (subscription.plan === 'premium') {
      planBadgeClass = 'bg-primary';
    } else if (subscription.plan === 'professional') {
      planBadgeClass = 'bg-info';
    }
    
    row.innerHTML = `
      <td>${subscription.userName}</td>
      <td><span class="badge ${planBadgeClass}">${subscription.plan}</span></td>
      <td>${subscription.startDate}</td>
      <td>${subscription.nextBillingDate}</td>
      <td>¥${subscription.amount.toLocaleString()}</td>
      <td><span class="badge ${statusBadgeClass}">${subscription.status}</span></td>
      <td>
        <div class="btn-group btn-group-sm">
          <button type="button" class="btn btn-outline-primary edit-subscription-btn" data-user-id="${subscription.userId}">
            <i class="fas fa-edit"></i>
          </button>
          <button type="button" class="btn btn-outline-danger cancel-subscription-btn" data-user-id="${subscription.userId}">
            <i class="fas fa-ban"></i>
          </button>
        </div>
      </td>
    `;
    
    subscriptionTableBody.appendChild(row);
  });
  
  // サブスクリプション編集ボタンのイベントリスナーを設定
  document.querySelectorAll('.edit-subscription-btn').forEach(button => {
    button.addEventListener('click', function() {
      const userId = this.getAttribute('data-user-id');
      editSubscription(userId);
    });
  });
  
  // サブスクリプションキャンセルボタンのイベントリスナーを設定
  document.querySelectorAll('.cancel-subscription-btn').forEach(button => {
    button.addEventListener('click', function() {
      const userId = this.getAttribute('data-user-id');
      cancelSubscription(userId);
    });
  });
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getSubscriptionData'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // サブスクリプションテーブルを生成
      const subscriptionTableBody = document.getElementById('subscriptionTableBody');
      subscriptionTableBody.innerHTML = '';
      
      data.subscriptions.forEach(subscription => {
        // 上記と同様の処理
      });
    } else {
      console.error('Error:', data.error);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
  */
}

/**
 * 統計チャートを初期化する関数
 */
function initCharts() {
  // 各チャート要素にcanvas要素を追加
  createCanvasIfNeeded('monthlyUsageChart');
  createCanvasIfNeeded('planDistributionChart');
  createCanvasIfNeeded('featureUsageChart');
  createCanvasIfNeeded('revenueChart');

  // 月間利用回数チャート
  const monthlyUsageCtx = document.getElementById('monthlyUsageChart-canvas').getContext('2d');
  const monthlyUsageChart = new Chart(monthlyUsageCtx, {
    type: 'line',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [{
        label: '利用回数',
        data: [120, 190, 300, 450, 580, 650],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // プラン別ユーザー分布チャート
  const planDistributionCtx = document.getElementById('planDistributionChart-canvas').getContext('2d');
  const planDistributionChart = new Chart(planDistributionCtx, {
    type: 'doughnut',
    data: {
      labels: ['無料プラン', 'プレミアムプラン', 'プロフェッショナルプラン'],
      datasets: [{
        data: [178, 65, 13],
        backgroundColor: [
          'rgba(108, 117, 125, 0.7)',
          'rgba(13, 110, 253, 0.7)',
          'rgba(13, 202, 240, 0.7)'
        ],
        borderColor: [
          'rgba(108, 117, 125, 1)',
          'rgba(13, 110, 253, 1)',
          'rgba(13, 202, 240, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // 機能別利用状況チャート
  const featureUsageCtx = document.getElementById('featureUsageChart-canvas').getContext('2d');
  const featureUsageChart = new Chart(featureUsageCtx, {
    type: 'bar',
    data: {
      labels: ['アセスメント', '関連図', '看護計画', '履歴閲覧', '編集'],
      datasets: [{
        label: '利用回数',
        data: [850, 420, 780, 350, 280],
        backgroundColor: 'rgba(40, 167, 69, 0.7)',
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // 月間収益推移チャート
  const revenueCtx = document.getElementById('revenueChart-canvas').getContext('2d');
  const revenueChart = new Chart(revenueCtx, {
    type: 'line',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [{
        label: '収益（円）',
        data: [78000, 95000, 120000, 135000, 148000, 156800],
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        borderColor: 'rgba(220, 53, 69, 1)',
        borderWidth: 2,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

/**
 * 指定されたID要素内にCanvas要素を作成する関数
 * @param {string} elementId - Canvas要素を作成する対象のdiv要素のID
 */
function createCanvasIfNeeded(elementId) {
  const container = document.getElementById(elementId);
  if (!container) return;

  // すでにCanvas要素が存在するか確認
  if (!document.getElementById(`${elementId}-canvas`)) {
    // Canvas要素を作成
    const canvas = document.createElement('canvas');
    canvas.id = `${elementId}-canvas`;
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    // div要素内にCanvas要素を追加
    container.innerHTML = '';
    container.appendChild(canvas);
  }
}

/**
 * システム設定を読み込む関数
 */
function loadSystemSettings() {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモックデータ（実際のデプロイ時には削除）
  const mockSystemSettings = {
    openaiApiKey: 'sk-*****************************',
    stripeApiKey: 'sk_test_***********************',
    stripeWebhookSecret: 'whsec_**********************',
    freePlanDailyLimit: 5,
    premiumPlanDailyLimit: 20,
    freeHistoryLimit: 3,
    smtpServer: 'smtp.example.com',
    smtpPort: 587,
    smtpUsername: 'noreply@nursing-ai.example.com',
    smtpPassword: '**********',
    backupFrequency: 'daily',
    backupRetention: 30
  };
  
  // システム設定フォームに値を設定
  document.getElementById('openaiApiKey').value = mockSystemSettings.openaiApiKey;
  document.getElementById('stripeApiKey').value = mockSystemSettings.stripeApiKey;
  document.getElementById('stripeWebhookSecret').value = mockSystemSettings.stripeWebhookSecret;
  document.getElementById('freePlanDailyLimit').value = mockSystemSettings.freePlanDailyLimit;
  document.getElementById('premiumPlanDailyLimit').value = mockSystemSettings.premiumPlanDailyLimit;
  document.getElementById('freeHistoryLimit').value = mockSystemSettings.freeHistoryLimit;
  document.getElementById('smtpServer').value = mockSystemSettings.smtpServer;
  document.getElementById('smtpPort').value = mockSystemSettings.smtpPort;
  document.getElementById('smtpUsername').value = mockSystemSettings.smtpUsername;
  document.getElementById('smtpPassword').value = mockSystemSettings.smtpPassword;
  document.getElementById('backupFrequency').value = mockSystemSettings.backupFrequency;
  document.getElementById('backupRetention').value = mockSystemSettings.backupRetention;
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getSystemSettings'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // システム設定フォームに値を設定
      document.getElementById('openaiApiKey').value = data.settings.openaiApiKey;
      document.getElementById('stripeApiKey').value = data.settings.stripeApiKey;
      document.getElementById('stripeWebhookSecret').value = data.settings.stripeWebhookSecret;
      document.getElementById('freePlanDailyLimit').value = data.settings.freePlanDailyLimit;
      document.getElementById('premiumPlanDailyLimit').value = data.settings.premiumPlanDailyLimit;
      document.getElementById('freeHistoryLimit').value = data.settings.freeHistoryLimit;
      document.getElementById('smtpServer').value = data.settings.smtpServer;
      document.getElementById('smtpPort').value = data.settings.smtpPort;
      document.getElementById('smtpUsername').value = data.settings.smtpUsername;
      document.getElementById('smtpPassword').value = data.settings.smtpPassword;
      document.getElementById('backupFrequency').value = data.settings.backupFrequency;
      document.getElementById('backupRetention').value = data.settings.backupRetention;
    } else {
      console.error('Error:', data.error);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
  */
}

/**
 * イベントリスナーを設定する関数
 */
function setupEventListeners() {
  // ログアウトボタンのイベントリスナー
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', function() {
      logout();
    });
  }

  // ユーザー管理タブのイベントリスナー
  const userManagementTab = document.getElementById('userManagementTab');
  if (userManagementTab) {
    userManagementTab.addEventListener('click', function() {
      loadUserManagementContent();
    });
  }

  // サブスクリプション管理タブのイベントリスナー
  const subscriptionManagementTab = document.getElementById('subscriptionManagementTab');
  if (subscriptionManagementTab) {
    subscriptionManagementTab.addEventListener('click', function() {
      loadSubscriptionManagementContent();
    });
  }

  // 統計タブのイベントリスナー
  const statisticsTab = document.getElementById('statisticsTab');
  if (statisticsTab) {
    statisticsTab.addEventListener('click', function() {
      loadStatisticsContent();
    });
  }

  // 設定タブのイベントリスナー
  const settingsTab = document.getElementById('settingsTab');
  if (settingsTab) {
    settingsTab.addEventListener('click', function() {
      loadSettingsContent();
    });
  }

  // ユーザー検索フォームのイベントリスナー
  const userSearchButton = document.getElementById('userSearchButton');
  if (userSearchButton) {
    userSearchButton.addEventListener('click', function(e) {
      e.preventDefault();
      const searchTerm = document.getElementById('userSearchInput').value;
      searchUsers(searchTerm);
    });
  }

  // ユーザー追加ボタンのイベントリスナー
  const addUserButton = document.getElementById('addUserButton');
  if (addUserButton) {
    addUserButton.addEventListener('click', function() {
      showAddUserModal();
    });
  }

  // ユーザー追加フォームのイベントリスナー
  const addUserForm = document.getElementById('addUserForm');
  if (addUserForm) {
    addUserForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const userData = {
        email: document.getElementById('newUserEmail').value,
        name: document.getElementById('newUserName').value,
        role: document.getElementById('newUserRole').value,
        subscription: document.getElementById('newUserSubscription').value
      };
      addUser(userData);
    });
  }

  // ユーザー編集モーダルの保存ボタンのイベントリスナー
  const saveUserEditButton = document.getElementById('saveUserEditButton');
  if (saveUserEditButton) {
    saveUserEditButton.addEventListener('click', function() {
      const userId = document.getElementById('editUserId').value;
      const userData = {
        email: document.getElementById('editUserEmail').value,
        name: document.getElementById('editUserName').value,
        role: document.getElementById('editUserRole').value,
        subscription: document.getElementById('editUserSubscription').value,
        status: document.getElementById('editUserStatus').value
      };
      updateUser(userId, userData);
    });
  }

  // ユーザー削除確認ボタンのイベントリスナー
  const confirmDeleteUserButton = document.getElementById('confirmDeleteUserButton');
  if (confirmDeleteUserButton) {
    confirmDeleteUserButton.addEventListener('click', function() {
      const userId = document.getElementById('deleteUserId').value;
      deleteUser(userId);
    });
  }

  // サブスクリプションプラン編集ボタンのイベントリスナー
  document.querySelectorAll('.edit-plan-button').forEach(button => {
    button.addEventListener('click', function() {
      const planId = this.getAttribute('data-plan-id');
      showEditPlanModal(planId);
    });
  });

  // サブスクリプションプラン編集フォームのイベントリスナー
  const editPlanForm = document.getElementById('editPlanForm');
  if (editPlanForm) {
    editPlanForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const planId = document.getElementById('editPlanId').value;
      const planData = {
        name: document.getElementById('editPlanName').value,
        price: document.getElementById('editPlanPrice').value,
        description: document.getElementById('editPlanDescription').value,
        features: document.getElementById('editPlanFeatures').value.split('\n'),
        dailyLimit: document.getElementById('editPlanDailyLimit').value,
        relationshipDiagramAccess: document.getElementById('editPlanRelationshipDiagramAccess').checked
      };
      updateSubscriptionPlan(planId, planData);
    });
  }

  // API設定フォームのイベントリスナー
  const apiSettingsForm = document.getElementById('apiSettingsForm');
  if (apiSettingsForm) {
    apiSettingsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const apiSettings = {
        openaiApiKey: document.getElementById('openaiApiKey').value,
        stripeSecretKey: document.getElementById('stripeSecretKey').value,
        stripePublicKey: document.getElementById('stripePublicKey').value
      };
      updateApiSettings(apiSettings);
    });
  }

  // 利用制限設定フォームのイベントリスナー
  const usageLimitForm = document.getElementById('usageLimitForm');
  if (usageLimitForm) {
    usageLimitForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const usageLimits = {
        freeUserDailyLimit: document.getElementById('freeUserDailyLimit').value,
        premiumUserDailyLimit: document.getElementById('premiumUserDailyLimit').value,
        professionalUserDailyLimit: document.getElementById('professionalUserDailyLimit').value,
        maxHistoryItemsFree: document.getElementById('maxHistoryItemsFree').value,
        maxHistoryItemsPremium: document.getElementById('maxHistoryItemsPremium').value,
        maxHistoryItemsProfessional: document.getElementById('maxHistoryItemsProfessional').value
      };
      updateUsageLimits(usageLimits);
    });
  }

  // バックアップ作成ボタンのイベントリスナー
  const createBackupButton = document.getElementById('createBackupButton');
  if (createBackupButton) {
    createBackupButton.addEventListener('click', function() {
      createBackup();
    });
  }

  // バックアップ復元フォームのイベントリスナー
  const restoreBackupForm = document.getElementById('restoreBackupForm');
  if (restoreBackupForm) {
    restoreBackupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const backupFile = document.getElementById('backupFileInput').files[0];
      if (backupFile) {
        restoreBackup(backupFile);
      } else {
        showAlert('バックアップファイルを選択してください', 'danger');
      }
    });
  }

  // 統計期間選択のイベントリスナー
  const statisticsPeriodSelect = document.getElementById('statisticsPeriod');
  if (statisticsPeriodSelect) {
    statisticsPeriodSelect.addEventListener('change', function() {
      const period = this.value;
      loadStatistics(period);
    });
  }

  // ページネーションのイベントリスナー
  document.querySelectorAll('.pagination-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      loadCurrentContentWithPage(page);
    });
  });

  // テーブルのソートヘッダーのイベントリスナー
  document.querySelectorAll('.sortable').forEach(header => {
    header.addEventListener('click', function() {
      const column = this.getAttribute('data-column');
      const currentOrder = this.getAttribute('data-order') || 'asc';
      const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
      
      // 全てのソートヘッダーからソート方向表示をクリア
      document.querySelectorAll('.sortable').forEach(h => {
        h.removeAttribute('data-order');
        h.querySelector('i').className = 'fas fa-sort';
      });
      
      // クリックされたヘッダーにソート方向を設定
      this.setAttribute('data-order', newOrder);
      this.querySelector('i').className = newOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
      
      // 現在のコンテンツをソートして再読み込み
      sortCurrentContent(column, newOrder);
    });
  });
};

/**
 * ユーザー検索を実行する関数
 * @param {string} searchTerm - 検索キーワード
 */
function searchUsers(searchTerm) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモックデータ（実際のデプロイ時には削除）
  const mockUserData = [
    {
      id: 'user001',
      name: '山田 太郎',
      email: 'yamada@example.com',
      role: 'user',
      plan: 'premium',
      registrationDate: '2025-01-15',
      status: 'active'
    },
    {
      id: 'user002',
      name: '佐藤 花子',
      email: 'sato@example.com',
      role: 'user',
      plan: 'free',
      registrationDate: '2025-02-20',
      status: 'active'
    }
  ];
  
  // 検索結果を表示
  const userTableBody = document.getElementById('userTableBody');
  userTableBody.innerHTML = '';
  
  // 検索キーワードが空の場合は全ユーザーを表示
  if (!searchTerm) {
    loadUserData();
    return;
  }
  
  // 検索キーワードに一致するユーザーをフィルタリング
  const filteredUsers = mockUserData.filter(user => 
    user.name.includes(searchTerm) || 
    user.email.includes(searchTerm) || 
    user.id.includes(searchTerm)
  );
  
  if (filteredUsers.length === 0) {
    userTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center">検索結果がありません</td>
      </tr>
    `;
    return;
  }
  
  // 検索結果を表示
  filteredUsers.forEach(user => {
    const row = document.createElement('tr');
    
    // ステータスに応じたバッジクラスを設定
    let statusBadgeClass = 'bg-success';
    if (user.status === 'suspended') {
      statusBadgeClass = 'bg-danger';
    } else if (user.status === 'pending') {
      statusBadgeClass = 'bg-warning';
    }
    
    // プランに応じたバッジクラスを設定
    let planBadgeClass = 'bg-secondary';
    if (user.plan === 'premium') {
      planBadgeClass = 'bg-primary';
    } else if (user.plan === 'professional') {
      planBadgeClass = 'bg-info';
    }
    
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td><span class="badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}">${user.role}</span></td>
      <td><span class="badge ${planBadgeClass}">${user.plan}</span></td>
      <td>${user.registrationDate}</td>
      <td><span class="badge ${statusBadgeClass}">${user.status}</span></td>
      <td>
        <div class="btn-group btn-group-sm">
          <button type="button" class="btn btn-outline-primary edit-user-btn" data-user-id="${user.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button type="button" class="btn btn-outline-danger delete-user-btn" data-user-id="${user.id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    `;
    
    userTableBody.appendChild(row);
  });
  
  // ユーザー編集ボタンのイベントリスナーを設定
  document.querySelectorAll('.edit-user-btn').forEach(button => {
    button.addEventListener('click', function() {
      const userId = this.getAttribute('data-user-id');
      editUser(userId);
    });
  });
  
  // ユーザー削除ボタンのイベントリスナーを設定
  document.querySelectorAll('.delete-user-btn').forEach(button => {
    button.addEventListener('click', function() {
      const userId = this.getAttribute('data-user-id');
      deleteUser(userId);
    });
  });
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'searchUsers',
      searchTerm: searchTerm
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // 検索結果を表示
      const userTableBody = document.getElementById('userTableBody');
      userTableBody.innerHTML = '';
      
      if (data.users.length === 0) {
        userTableBody.innerHTML = `
          <tr>
            <td colspan="8" class="text-center">検索結果がありません</td>
          </tr>
        `;
        return;
      }
      
      data.users.forEach(user => {
        // 上記と同様の処理
      });
    } else {
      console.error('Error:', data.error);
      showAlert('ユーザー検索中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('ユーザー検索中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * ユーザー編集モーダルを表示する関数
 * @param {string} userId - 編集するユーザーのID
 */
function editUser(userId) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモックデータ（実際のデプロイ時には削除）
  const mockUserData = {
    id: userId,
    name: '山田 太郎',
    email: 'yamada@example.com',
    role: 'user',
    plan: 'premium',
    status: 'active'
  };
  
  // 編集モーダルが存在しない場合は作成
  if (!document.getElementById('editUserModal')) {
    const modalHTML = `
      <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editUserModalLabel">ユーザー編集</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="editUserForm">
                <input type="hidden" id="editUserId">
                <div class="mb-3">
                  <label for="editUserName" class="form-label">氏名</label>
                  <input type="text" class="form-control" id="editUserName" required>
                </div>
                <div class="mb-3">
                  <label for="editUserEmail" class="form-label">メールアドレス</label>
                  <input type="email" class="form-control" id="editUserEmail" required>
                </div>
                <div class="mb-3">
                  <label for="editUserRole" class="form-label">権限</label>
                  <select class="form-select" id="editUserRole" required>
                    <option value="user">一般ユーザー</option>
                    <option value="admin">管理者</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="editUserSubscription" class="form-label">プラン</label>
                  <select class="form-select" id="editUserSubscription" required>
                    <option value="free">無料プラン</option>
                    <option value="premium">プレミアムプラン</option>
                    <option value="professional">プロフェッショナルプラン</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="editUserStatus" class="form-label">ステータス</label>
                  <select class="form-select" id="editUserStatus" required>
                    <option value="active">有効</option>
                    <option value="suspended">停止</option>
                    <option value="pending">保留</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" class="btn btn-primary" id="saveUserEditButton">保存</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 保存ボタンのイベントリスナーを設定
    document.getElementById('saveUserEditButton').addEventListener('click', function() {
      const userId = document.getElementById('editUserId').value;
      const userData = {
        name: document.getElementById('editUserName').value,
        email: document.getElementById('editUserEmail').value,
        role: document.getElementById('editUserRole').value,
        plan: document.getElementById('editUserSubscription').value,
        status: document.getElementById('editUserStatus').value
      };
      updateUser(userId, userData);
    });
  }
  
  // モーダルにユーザーデータを設定
  document.getElementById('editUserId').value = mockUserData.id;
  document.getElementById('editUserName').value = mockUserData.name;
  document.getElementById('editUserEmail').value = mockUserData.email;
  document.getElementById('editUserRole').value = mockUserData.role;
  document.getElementById('editUserSubscription').value = mockUserData.plan;
  document.getElementById('editUserStatus').value = mockUserData.status;
  
  // モーダルを表示
  const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
  editUserModal.show();
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getUserById',
      userId: userId
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // モーダルにユーザーデータを設定
      document.getElementById('editUserId').value = data.user.id;
      document.getElementById('editUserName').value = data.user.name;
      document.getElementById('editUserEmail').value = data.user.email;
      document.getElementById('editUserRole').value = data.user.role;
      document.getElementById('editUserSubscription').value = data.user.plan;
      document.getElementById('editUserStatus').value = data.user.status;
      
      // モーダルを表示
      const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
      editUserModal.show();
    } else {
      console.error('Error:', data.error);
      showAlert('ユーザー情報の取得中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('ユーザー情報の取得中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * ユーザー情報を更新する関数
 * @param {string} userId - 更新するユーザーのID
 * @param {Object} userData - 更新するユーザーデータ
 */
function updateUser(userId, userData) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('ユーザー情報を更新:', userId, userData);
  
  // モーダルを閉じる
  const editUserModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
  if (editUserModal) {
    editUserModal.hide();
  }
  
  // 成功メッセージを表示
  showAlert('ユーザー情報を更新しました', 'success');
  
  // ユーザーデータを再読み込み
  loadUserData();
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'updateUser',
      userId: userId,
      userData: userData
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // モーダルを閉じる
      const editUserModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
      if (editUserModal) {
        editUserModal.hide();
      }
      
      // 成功メッセージを表示
      showAlert('ユーザー情報を更新しました', 'success');
      
      // ユーザーデータを再読み込み
      loadUserData();
    } else {
      console.error('Error:', data.error);
      showAlert('ユーザー情報の更新中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('ユーザー情報の更新中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * ユーザー削除確認モーダルを表示する関数
 * @param {string} userId - 削除するユーザーのID
 */
function deleteUser(userId) {
  // 削除確認モーダルが存在しない場合は作成
  if (!document.getElementById('deleteUserModal')) {
    const modalHTML = `
      <div class="modal fade" id="deleteUserModal" tabindex="-1" aria-labelledby="deleteUserModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteUserModalLabel">ユーザー削除の確認</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>このユーザーを削除してもよろしいですか？</p>
              <p class="text-danger">この操作は取り消せません。</p>
              <input type="hidden" id="deleteUserId">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" class="btn btn-danger" id="confirmDeleteUserButton">削除</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 削除確認ボタンのイベントリスナーを設定
    document.getElementById('confirmDeleteUserButton').addEventListener('click', function() {
      const userId = document.getElementById('deleteUserId').value;
      
      // 実際のデプロイ時にはGASのWebアプリURLを設定
      const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
      
      // 開発用のモック処理（実際のデプロイ時には削除）
      console.log('ユーザーを削除:', userId);
      
      // モーダルを閉じる
      const deleteUserModal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
      if (deleteUserModal) {
        deleteUserModal.hide();
      }
      
      // 成功メッセージを表示
      showAlert('ユーザーを削除しました', 'success');
      
      // ユーザーデータを再読み込み
      loadUserData();
      
      /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
      fetch(gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteUser',
          userId: userId
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // モーダルを閉じる
          const deleteUserModal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
          if (deleteUserModal) {
            deleteUserModal.hide();
          }
          
          // 成功メッセージを表示
          showAlert('ユーザーを削除しました', 'success');
          
          // ユーザーデータを再読み込み
          loadUserData();
        } else {
          console.error('Error:', data.error);
          showAlert('ユーザーの削除中にエラーが発生しました', 'danger');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showAlert('ユーザーの削除中にエラーが発生しました', 'danger');
      });
      */
    });
  }
  
  // 削除するユーザーIDを設定
  document.getElementById('deleteUserId').value = userId;
  
  // モーダルを表示
  const deleteUserModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
  deleteUserModal.show();
}

/**
 * ユーザー追加モーダルを表示する関数
 */
function showAddUserModal() {
  // ユーザー追加モーダルが存在しない場合は作成
  if (!document.getElementById('addUserModal')) {
    const modalHTML = `
      <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addUserModalLabel">新規ユーザー追加</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="addUserForm">
                <div class="mb-3">
                  <label for="newUserName" class="form-label">氏名</label>
                  <input type="text" class="form-control" id="newUserName" required>
                </div>
                <div class="mb-3">
                  <label for="newUserEmail" class="form-label">メールアドレス</label>
                  <input type="email" class="form-control" id="newUserEmail" required>
                </div>
                <div class="mb-3">
                  <label for="newUserRole" class="form-label">権限</label>
                  <select class="form-select" id="newUserRole" required>
                    <option value="user">一般ユーザー</option>
                    <option value="admin">管理者</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="newUserSubscription" class="form-label">プラン</label>
                  <select class="form-select" id="newUserSubscription" required>
                    <option value="free">無料プラン</option>
                    <option value="premium">プレミアムプラン</option>
                    <option value="professional">プロフェッショナルプラン</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="submit" form="addUserForm" class="btn btn-primary">追加</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // フォーム送信イベントリスナーを設定
    document.getElementById('addUserForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const userData = {
        name: document.getElementById('newUserName').value,
        email: document.getElementById('newUserEmail').value,
        role: document.getElementById('newUserRole').value,
        plan: document.getElementById('newUserSubscription').value
      };
      addUser(userData);
    });
  }
  
  // フォームをリセット
  document.getElementById('addUserForm').reset();
  
  // モーダルを表示
  const addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'));
  addUserModal.show();
}

/**
 * 新規ユーザーを追加する関数
 * @param {Object} userData - 追加するユーザーデータ
 */
function addUser(userData) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('新規ユーザーを追加:', userData);
  
  // モーダルを閉じる
  const addUserModal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
  if (addUserModal) {
    addUserModal.hide();
  }
  
  // 成功メッセージを表示
  showAlert('新規ユーザーを追加しました', 'success');
  
  // ユーザーデータを再読み込み
  loadUserData();
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'addUser',
      userData: userData
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // モーダルを閉じる
      const addUserModal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
      if (addUserModal) {
        addUserModal.hide();
      }
      
      // 成功メッセージを表示
      showAlert('新規ユーザーを追加しました', 'success');
      
      // ユーザーデータを再読み込み
      loadUserData();
    } else {
      console.error('Error:', data.error);
      showAlert('ユーザーの追加中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('ユーザーの追加中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * サブスクリプション編集モーダルを表示する関数
 * @param {string} userId - 編集するサブスクリプションのユーザーID
 */
function editSubscription(userId) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモックデータ（実際のデプロイ時には削除）
  const mockSubscriptionData = {
    userId: userId,
    userName: '山田 太郎',
    plan: 'premium',
    startDate: '2025-01-15',
    nextBillingDate: '2025-04-15',
    amount: 980,
    status: 'active'
  };
  
  // 編集モーダルが存在しない場合は作成
  if (!document.getElementById('editSubscriptionModal')) {
    const modalHTML = `
      <div class="modal fade" id="editSubscriptionModal" tabindex="-1" aria-labelledby="editSubscriptionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editSubscriptionModalLabel">サブスクリプション編集</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="editSubscriptionForm">
                <input type="hidden" id="editSubscriptionUserId">
                <div class="mb-3">
                  <label for="editSubscriptionUserName" class="form-label">ユーザー名</label>
                  <input type="text" class="form-control" id="editSubscriptionUserName" readonly>
                </div>
                <div class="mb-3">
                  <label for="editSubscriptionPlan" class="form-label">プラン</label>
                  <select class="form-select" id="editSubscriptionPlan" required>
                    <option value="free">無料プラン</option>
                    <option value="premium">プレミアムプラン</option>
                    <option value="professional">プロフェッショナルプラン</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="editSubscriptionStartDate" class="form-label">開始日</label>
                  <input type="date" class="form-control" id="editSubscriptionStartDate" required>
                </div>
                <div class="mb-3">
                  <label for="editSubscriptionNextBillingDate" class="form-label">次回請求日</label>
                  <input type="date" class="form-control" id="editSubscriptionNextBillingDate" required>
                </div>
                <div class="mb-3">
                  <label for="editSubscriptionAmount" class="form-label">金額（円）</label>
                  <input type="number" class="form-control" id="editSubscriptionAmount" required>
                </div>
                <div class="mb-3">
                  <label for="editSubscriptionStatus" class="form-label">ステータス</label>
                  <select class="form-select" id="editSubscriptionStatus" required>
                    <option value="active">有効</option>
                    <option value="canceled">キャンセル</option>
                    <option value="past_due">支払い遅延</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" class="btn btn-primary" id="saveSubscriptionEditButton">保存</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 保存ボタンのイベントリスナーを設定
    document.getElementById('saveSubscriptionEditButton').addEventListener('click', function() {
      const userId = document.getElementById('editSubscriptionUserId').value;
      const subscriptionData = {
        plan: document.getElementById('editSubscriptionPlan').value,
        startDate: document.getElementById('editSubscriptionStartDate').value,
        nextBillingDate: document.getElementById('editSubscriptionNextBillingDate').value,
        amount: document.getElementById('editSubscriptionAmount').value,
        status: document.getElementById('editSubscriptionStatus').value
      };
      updateSubscription(userId, subscriptionData);
    });
  }
  
  // モーダルにサブスクリプションデータを設定
  document.getElementById('editSubscriptionUserId').value = mockSubscriptionData.userId;
  document.getElementById('editSubscriptionUserName').value = mockSubscriptionData.userName;
  document.getElementById('editSubscriptionPlan').value = mockSubscriptionData.plan;
  document.getElementById('editSubscriptionStartDate').value = mockSubscriptionData.startDate;
  document.getElementById('editSubscriptionNextBillingDate').value = mockSubscriptionData.nextBillingDate;
  document.getElementById('editSubscriptionAmount').value = mockSubscriptionData.amount;
  document.getElementById('editSubscriptionStatus').value = mockSubscriptionData.status;
  
  // モーダルを表示
  const editSubscriptionModal = new bootstrap.Modal(document.getElementById('editSubscriptionModal'));
  editSubscriptionModal.show();
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getSubscriptionByUserId',
      userId: userId
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // モーダルにサブスクリプションデータを設定
      document.getElementById('editSubscriptionUserId').value = data.subscription.userId;
      document.getElementById('editSubscriptionUserName').value = data.subscription.userName;
      document.getElementById('editSubscriptionPlan').value = data.subscription.plan;
      document.getElementById('editSubscriptionStartDate').value = data.subscription.startDate;
      document.getElementById('editSubscriptionNextBillingDate').value = data.subscription.nextBillingDate;
      document.getElementById('editSubscriptionAmount').value = data.subscription.amount;
      document.getElementById('editSubscriptionStatus').value = data.subscription.status;
      
      // モーダルを表示
      const editSubscriptionModal = new bootstrap.Modal(document.getElementById('editSubscriptionModal'));
      editSubscriptionModal.show();
    } else {
      console.error('Error:', data.error);
      showAlert('サブスクリプション情報の取得中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('サブスクリプション情報の取得中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * サブスクリプション情報を更新する関数
 * @param {string} userId - 更新するサブスクリプションのユーザーID
 * @param {Object} subscriptionData - 更新するサブスクリプションデータ
 */
function updateSubscription(userId, subscriptionData) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('サブスクリプション情報を更新:', userId, subscriptionData);
  
  // モーダルを閉じる
  const editSubscriptionModal = bootstrap.Modal.getInstance(document.getElementById('editSubscriptionModal'));
  if (editSubscriptionModal) {
    editSubscriptionModal.hide();
  }
  
  // 成功メッセージを表示
  showAlert('サブスクリプション情報を更新しました', 'success');
  
  // サブスクリプションデータを再読み込み
  loadSubscriptionData();
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'updateSubscription',
      userId: userId,
      subscriptionData: subscriptionData
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // モーダルを閉じる
      const editSubscriptionModal = bootstrap.Modal.getInstance(document.getElementById('editSubscriptionModal'));
      if (editSubscriptionModal) {
        editSubscriptionModal.hide();
      }
      
      // 成功メッセージを表示
      showAlert('サブスクリプション情報を更新しました', 'success');
      
      // サブスクリプションデータを再読み込み
      loadSubscriptionData();
    } else {
      console.error('Error:', data.error);
      showAlert('サブスクリプション情報の更新中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('サブスクリプション情報の更新中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * サブスクリプション解約確認モーダルを表示する関数
 * @param {string} userId - 解約するサブスクリプションのユーザーID
 */
function cancelSubscription(userId) {
  // 解約確認モーダルが存在しない場合は作成
  if (!document.getElementById('cancelSubscriptionModal')) {
    const modalHTML = `
      <div class="modal fade" id="cancelSubscriptionModal" tabindex="-1" aria-labelledby="cancelSubscriptionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="cancelSubscriptionModalLabel">サブスクリプション解約の確認</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>このサブスクリプションを解約してもよろしいですか？</p>
              <p class="text-danger">解約後、ユーザーは無料プランに戻ります。</p>
              <input type="hidden" id="cancelSubscriptionUserId">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" class="btn btn-danger" id="confirmCancelSubscriptionButton">解約</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 解約確認ボタンのイベントリスナーを設定
    document.getElementById('confirmCancelSubscriptionButton').addEventListener('click', function() {
      const userId = document.getElementById('cancelSubscriptionUserId').value;
      
      // 実際のデプロイ時にはGASのWebアプリURLを設定
      const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
      
      // 開発用のモック処理（実際のデプロイ時には削除）
      console.log('サブスクリプションを解約:', userId);
      
      // モーダルを閉じる
      const cancelSubscriptionModal = bootstrap.Modal.getInstance(document.getElementById('cancelSubscriptionModal'));
      if (cancelSubscriptionModal) {
        cancelSubscriptionModal.hide();
      }
      
      // 成功メッセージを表示
      showAlert('サブスクリプションを解約しました', 'success');
      
      // サブスクリプションデータを再読み込み
      loadSubscriptionData();
      
      /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
      fetch(gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancelSubscription',
          userId: userId
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // モーダルを閉じる
          const cancelSubscriptionModal = bootstrap.Modal.getInstance(document.getElementById('cancelSubscriptionModal'));
          if (cancelSubscriptionModal) {
            cancelSubscriptionModal.hide();
          }
          
          // 成功メッセージを表示
          showAlert('サブスクリプションを解約しました', 'success');
          
          // サブスクリプションデータを再読み込み
          loadSubscriptionData();
        } else {
          console.error('Error:', data.error);
          showAlert('サブスクリプションの解約中にエラーが発生しました', 'danger');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showAlert('サブスクリプションの解約中にエラーが発生しました', 'danger');
      });
      */
    });
  }
  
  // 解約するユーザーIDを設定
  document.getElementById('cancelSubscriptionUserId').value = userId;
  
  // モーダルを表示
  const cancelSubscriptionModal = new bootstrap.Modal(document.getElementById('cancelSubscriptionModal'));
  cancelSubscriptionModal.show();
}

/**
 * プラン編集モーダルを表示する関数
 * @param {string} planId - 編集するプランのID
 */
function showEditPlanModal(planId) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモックデータ（実際のデプロイ時には削除）
  const mockPlanData = {
    id: planId,
    name: planId === 'free' ? '無料プラン' : planId === 'premium' ? 'プレミアムプラン' : 'プロフェッショナルプラン',
    price: planId === 'free' ? 0 : planId === 'premium' ? 980 : 2980,
    description: planId === 'free' ? '基本機能のみ' : planId === 'premium' ? '一般的な利用に最適' : 'プロフェッショナル向け',
    features: planId === 'free' ? 
      ['1日5回までの利用', 'アセスメント生成', '履歴保存（最大3件）'] : 
      planId === 'premium' ? 
      ['1日20回までの利用', 'アセスメント生成', '関連図の閲覧', '看護計画の完全表示', '履歴保存（最大50件）'] : 
      ['無制限の利用', 'アセスメント生成', '関連図の閲覧・カスタマイズ', '看護計画の完全表示・編集', '履歴保存（無制限）'],
    dailyLimit: planId === 'free' ? 5 : planId === 'premium' ? 20 : 999,
    relationshipDiagramAccess: planId !== 'free'
  };
  
  // 編集モーダルが存在しない場合は作成
  if (!document.getElementById('editPlanModal')) {
    const modalHTML = `
      <div class="modal fade" id="editPlanModal" tabindex="-1" aria-labelledby="editPlanModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editPlanModalLabel">プラン編集</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="editPlanForm">
                <input type="hidden" id="editPlanId">
                <div class="mb-3">
                  <label for="editPlanName" class="form-label">プラン名</label>
                  <input type="text" class="form-control" id="editPlanName" required>
                </div>
                <div class="mb-3">
                  <label for="editPlanPrice" class="form-label">価格（円/月）</label>
                  <input type="number" class="form-control" id="editPlanPrice" required>
                </div>
                <div class="mb-3">
                  <label for="editPlanDescription" class="form-label">説明</label>
                  <input type="text" class="form-control" id="editPlanDescription" required>
                </div>
                <div class="mb-3">
                  <label for="editPlanFeatures" class="form-label">機能（1行に1つ）</label>
                  <textarea class="form-control" id="editPlanFeatures" rows="5" required></textarea>
                </div>
                <div class="mb-3">
                  <label for="editPlanDailyLimit" class="form-label">1日の利用回数制限</label>
                  <input type="number" class="form-control" id="editPlanDailyLimit" min="1" required>
                </div>
                <div class="mb-3 form-check">
                  <input type="checkbox" class="form-check-input" id="editPlanRelationshipDiagramAccess">
                  <label class="form-check-label" for="editPlanRelationshipDiagramAccess">関連図アクセス権</label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" class="btn btn-primary" id="savePlanEditButton">保存</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 保存ボタンのイベントリスナーを設定
    document.getElementById('savePlanEditButton').addEventListener('click', function() {
      const planId = document.getElementById('editPlanId').value;
      const planData = {
        name: document.getElementById('editPlanName').value,
        price: document.getElementById('editPlanPrice').value,
        description: document.getElementById('editPlanDescription').value,
        features: document.getElementById('editPlanFeatures').value.split('\n'),
        dailyLimit: document.getElementById('editPlanDailyLimit').value,
        relationshipDiagramAccess: document.getElementById('editPlanRelationshipDiagramAccess').checked
      };
      updateSubscriptionPlan(planId, planData);
    });
  }
  
  // モーダルにプランデータを設定
  document.getElementById('editPlanId').value = mockPlanData.id;
  document.getElementById('editPlanName').value = mockPlanData.name;
  document.getElementById('editPlanPrice').value = mockPlanData.price;
  document.getElementById('editPlanDescription').value = mockPlanData.description;
  document.getElementById('editPlanFeatures').value = mockPlanData.features.join('\n');
  document.getElementById('editPlanDailyLimit').value = mockPlanData.dailyLimit;
  document.getElementById('editPlanRelationshipDiagramAccess').checked = mockPlanData.relationshipDiagramAccess;
  
  // モーダルを表示
  const editPlanModal = new bootstrap.Modal(document.getElementById('editPlanModal'));
  editPlanModal.show();
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getPlanById',
      planId: planId
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // モーダルにプランデータを設定
      document.getElementById('editPlanId').value = data.plan.id;
      document.getElementById('editPlanName').value = data.plan.name;
      document.getElementById('editPlanPrice').value = data.plan.price;
      document.getElementById('editPlanDescription').value = data.plan.description;
      document.getElementById('editPlanFeatures').value = data.plan.features.join('\n');
      document.getElementById('editPlanDailyLimit').value = data.plan.dailyLimit;
      document.getElementById('editPlanRelationshipDiagramAccess').checked = data.plan.relationshipDiagramAccess;
      
      // モーダルを表示
      const editPlanModal = new bootstrap.Modal(document.getElementById('editPlanModal'));
      editPlanModal.show();
    } else {
      console.error('Error:', data.error);
      showAlert('プラン情報の取得中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('プラン情報の取得中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * サブスクリプションプランを更新する関数
 * @param {string} planId - 更新するプランのID
 * @param {Object} planData - 更新するプランデータ
 */
function updateSubscriptionPlan(planId, planData) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('プラン情報を更新:', planId, planData);
  
  // モーダルを閉じる
  const editPlanModal = bootstrap.Modal.getInstance(document.getElementById('editPlanModal'));
  if (editPlanModal) {
    editPlanModal.hide();
  }
  
  // 成功メッセージを表示
  showAlert('プラン情報を更新しました', 'success');
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'updatePlan',
      planId: planId,
      planData: planData
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // モーダルを閉じる
      const editPlanModal = bootstrap.Modal.getInstance(document.getElementById('editPlanModal'));
      if (editPlanModal) {
        editPlanModal.hide();
      }
      
      // 成功メッセージを表示
      showAlert('プラン情報を更新しました', 'success');
    } else {
      console.error('Error:', data.error);
      showAlert('プラン情報の更新中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('プラン情報の更新中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * API設定を更新する関数
 * @param {Object} apiSettings - 更新するAPI設定
 */
function updateApiSettings(apiSettings) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('API設定を更新:', apiSettings);
  
  // 成功メッセージを表示
  showAlert('API設定を更新しました', 'success');
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'updateApiSettings',
      apiSettings: apiSettings
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // 成功メッセージを表示
      showAlert('API設定を更新しました', 'success');
    } else {
      console.error('Error:', data.error);
      showAlert('API設定の更新中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('API設定の更新中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * 利用制限設定を更新する関数
 * @param {Object} usageLimits - 更新する利用制限設定
 */
function updateUsageLimits(usageLimits) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('利用制限設定を更新:', usageLimits);
  
  // 成功メッセージを表示
  showAlert('利用制限設定を更新しました', 'success');
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'updateUsageLimits',
      usageLimits: usageLimits
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // 成功メッセージを表示
      showAlert('利用制限設定を更新しました', 'success');
    } else {
      console.error('Error:', data.error);
      showAlert('利用制限設定の更新中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('利用制限設定の更新中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * バックアップを作成する関数
 */
function createBackup() {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('バックアップを作成');
  
  // 成功メッセージを表示
  showAlert('バックアップを作成しました', 'success');
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'createBackup'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // 成功メッセージを表示
      showAlert('バックアップを作成しました', 'success');
      
      // バックアップファイルのダウンロードリンクを提供
      if (data.backupUrl) {
        const downloadLink = document.createElement('a');
        downloadLink.href = data.backupUrl;
        downloadLink.download = data.backupFileName || 'backup.json';
        downloadLink.click();
      }
    } else {
      console.error('Error:', data.error);
      showAlert('バックアップの作成中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('バックアップの作成中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * バックアップを復元する関数
 * @param {File} backupFile - 復元するバックアップファイル
 */
function restoreBackup(backupFile) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('バックアップを復元:', backupFile.name);
  
  // 成功メッセージを表示
  showAlert('バックアップを復元しました', 'success');
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  const formData = new FormData();
  formData.append('action', 'restoreBackup');
  formData.append('backupFile', backupFile);
  
  fetch(gasUrl, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // 成功メッセージを表示
      showAlert('バックアップを復元しました', 'success');
      
      // 各種データを再読み込み
      loadDashboardData();
      loadUserData();
      loadSubscriptionData();
      loadSystemSettings();
    } else {
      console.error('Error:', data.error);
      showAlert('バックアップの復元中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('バックアップの復元中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * 統計データを読み込む関数
 * @param {string} period - 統計期間（例: 'week', 'month', 'year'）
 */
function loadStatistics(period) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('統計データを読み込み:', period);
  
  // 期間に応じてラベルを変更
  let labels = [];
  if (period === 'week') {
    labels = ['月', '火', '水', '木', '金', '土', '日'];
  } else if (period === 'month') {
    labels = ['1週目', '2週目', '3週目', '4週目'];
  } else if (period === 'year') {
    labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  } else {
    labels = ['1月', '2月', '3月', '4月', '5月', '6月'];
  }
  
  // チャートを更新
  const monthlyUsageChart = Chart.getChart('monthlyUsageChart');
  if (monthlyUsageChart) {
    monthlyUsageChart.data.labels = labels;
    monthlyUsageChart.data.datasets[0].data = Array.from({length: labels.length}, () => Math.floor(Math.random() * 500) + 100);
    monthlyUsageChart.update();
  }
  
  const revenueChart = Chart.getChart('revenueChart');
  if (revenueChart) {
    revenueChart.data.labels = labels;
    revenueChart.data.datasets[0].data = Array.from({length: labels.length}, () => Math.floor(Math.random() * 100000) + 50000);
    revenueChart.update();
  }
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getStatistics',
      period: period
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // チャートを更新
      const monthlyUsageChart = Chart.getChart('monthlyUsageChart');
      if (monthlyUsageChart) {
        monthlyUsageChart.data.labels = data.labels;
        monthlyUsageChart.data.datasets[0].data = data.usageData;
        monthlyUsageChart.update();
      }
      
      const planDistributionChart = Chart.getChart('planDistributionChart');
      if (planDistributionChart) {
        planDistributionChart.data.datasets[0].data = data.planDistribution;
        planDistributionChart.update();
      }
      
      const featureUsageChart = Chart.getChart('featureUsageChart');
      if (featureUsageChart) {
        featureUsageChart.data.datasets[0].data = data.featureUsage;
        featureUsageChart.update();
      }
      
      const revenueChart = Chart.getChart('revenueChart');
      if (revenueChart) {
        revenueChart.data.labels = data.labels;
        revenueChart.data.datasets[0].data = data.revenueData;
        revenueChart.update();
      }
    } else {
      console.error('Error:', data.error);
      showAlert('統計データの読み込み中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('統計データの読み込み中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * 現在のコンテンツをページネーション付きで読み込む関数
 * @param {number} page - ページ番号
 */
function loadCurrentContentWithPage(page) {
  // 現在アクティブなタブを取得
  const activeTab = document.querySelector('.nav-link.active');
  if (!activeTab) return;
  
  const tabId = activeTab.id;
  
  // タブに応じてコンテンツを読み込み
  if (tabId === 'users-tab') {
    loadUserData(page);
  } else if (tabId === 'subscriptions-tab') {
    loadSubscriptionData(page);
  }
}

/**
 * 現在のコンテンツをソートする関数
 * @param {string} column - ソート対象のカラム
 * @param {string} order - ソート順（'asc' または 'desc'）
 */
function sortCurrentContent(column, order) {
  // 現在アクティブなタブを取得
  const activeTab = document.querySelector('.nav-link.active');
  if (!activeTab) return;
  
  const tabId = activeTab.id;
  
  // タブに応じてコンテンツをソート
  if (tabId === 'users-tab') {
    sortUserData(column, order);
  } else if (tabId === 'subscriptions-tab') {
    sortSubscriptionData(column, order);
  }
}

/**
 * ユーザーデータをソートする関数
 * @param {string} column - ソート対象のカラム
 * @param {string} order - ソート順（'asc' または 'desc'）
 */
function sortUserData(column, order) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('ユーザーデータをソート:', column, order);
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getUserData',
      sortColumn: column,
      sortOrder: order
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // ユーザーテーブルを更新
      const userTableBody = document.getElementById('userTableBody');
      userTableBody.innerHTML = '';
      
      data.users.forEach(user => {
        // 上記と同様の処理
      });
    } else {
      console.error('Error:', data.error);
      showAlert('ユーザーデータのソート中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('ユーザーデータのソート中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * サブスクリプションデータをソートする関数
 * @param {string} column - ソート対象のカラム
 * @param {string} order - ソート順（'asc' または 'desc'）
 */
function sortSubscriptionData(column, order) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('サブスクリプションデータをソート:', column, order);
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getSubscriptionData',
      sortColumn: column,
      sortOrder: order
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // サブスクリプションテーブルを更新
      const subscriptionTableBody = document.getElementById('subscriptionTableBody');
      subscriptionTableBody.innerHTML = '';
      
      data.subscriptions.forEach(subscription => {
        // 上記と同様の処理
      });
    } else {
      console.error('Error:', data.error);
      showAlert('サブスクリプションデータのソート中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('サブスクリプションデータのソート中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * アラートを表示する関数
 * @param {string} message - 表示するメッセージ
 * @param {string} type - アラートタイプ（'success', 'danger', 'warning', 'info'）
 */
function showAlert(message, type) {
  // アラートコンテナが存在しない場合は作成
  let alertContainer = document.getElementById('alertContainer');
  if (!alertContainer) {
    alertContainer = document.createElement('div');
    alertContainer.id = 'alertContainer';
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '20px';
    alertContainer.style.right = '20px';
    alertContainer.style.zIndex = '9999';
    document.body.appendChild(alertContainer);
  }
  
  // アラート要素を作成
  const alertElement = document.createElement('div');
  alertElement.className = `alert alert-${type} alert-dismissible fade show`;
  alertElement.role = 'alert';
  alertElement.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  // アラートコンテナに追加
  alertContainer.appendChild(alertElement);
  
  // 5秒後に自動的に閉じる
  setTimeout(() => {
    const bsAlert = new bootstrap.Alert(alertElement);
    bsAlert.close();
  }, 5000);
}

/**
 * ログアウト処理を行う関数
 */
function logout() {
  // ローカルストレージからユーザー情報を削除
  localStorage.removeItem('userInfo');
  
  // ログインページにリダイレクト
  window.location.href = 'login.html';
}

/**
 * ユーザー管理コンテンツを読み込む関数
 */
function loadUserManagementContent() {
  // ユーザーデータを読み込み
  loadUserData();
}

/**
 * サブスクリプション管理コンテンツを読み込む関数
 */
function loadSubscriptionManagementContent() {
  // サブスクリプションデータを読み込み
  loadSubscriptionData();
}

/**
 * 統計コンテンツを読み込む関数
 */
function loadStatisticsContent() {
  // 統計チャートを初期化
  initCharts();
}

/**
 * 設定コンテンツを読み込む関数
 */
function loadSettingsContent() {
  // システム設定を読み込み
  loadSystemSettings();
}

/**
 * 新規プラン作成ボタンのイベントハンドラー
 */
function setupCreatePlanButton() {
  const createPlanButton = document.getElementById('createPlanButton');
  if (createPlanButton) {
    createPlanButton.addEventListener('click', function () {
      showCreatePlanModal();
    });
  }
}

/**
 * 新規プラン作成モーダルを表示する関数
 */
function showCreatePlanModal() {
  // 新規プラン作成モーダルが存在しない場合は作成
  if (!document.getElementById('createPlanModal')) {
    const modalHTML = `
      <div class="modal fade" id="createPlanModal" tabindex="-1" aria-labelledby="createPlanModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="createPlanModalLabel">新規プラン作成</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="createPlanForm">
                <div class="mb-3">
                  <label for="newPlanId" class="form-label">プランID</label>
                  <input type="text" class="form-control" id="newPlanId" required>
                  <div class="form-text">英数字のみ使用可能（例: basic, advanced）</div>
                </div>
                <div class="mb-3">
                  <label for="newPlanName" class="form-label">プラン名</label>
                  <input type="text" class="form-control" id="newPlanName" required>
                </div>
                <div class="mb-3">
                  <label for="newPlanPrice" class="form-label">価格（円/月）</label>
                  <input type="number" class="form-control" id="newPlanPrice" required>
                </div>
                <div class="mb-3">
                  <label for="newPlanDescription" class="form-label">説明</label>
                  <input type="text" class="form-control" id="newPlanDescription" required>
                </div>
                <div class="mb-3">
                  <label for="newPlanFeatures" class="form-label">機能（1行に1つ）</label>
                  <textarea class="form-control" id="newPlanFeatures" rows="5" required></textarea>
                </div>
                <div class="mb-3">
                  <label for="newPlanDailyLimit" class="form-label">1日の利用回数制限</label>
                  <input type="number" class="form-control" id="newPlanDailyLimit" min="1" required>
                </div>
                <div class="mb-3 form-check">
                  <input type="checkbox" class="form-check-input" id="newPlanRelationshipDiagramAccess">
                  <label class="form-check-label" for="newPlanRelationshipDiagramAccess">関連図アクセス権</label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" class="btn btn-primary" id="saveNewPlanButton">作成</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 保存ボタンのイベントリスナーを設定
    document.getElementById('saveNewPlanButton').addEventListener('click', function () {
      const planData = {
        id: document.getElementById('newPlanId').value,
        name: document.getElementById('newPlanName').value,
        price: document.getElementById('newPlanPrice').value,
        description: document.getElementById('newPlanDescription').value,
        features: document.getElementById('newPlanFeatures').value.split('\n'),
        dailyLimit: document.getElementById('newPlanDailyLimit').value,
        relationshipDiagramAccess: document.getElementById('newPlanRelationshipDiagramAccess').checked
      };
      createPlan(planData);
    });
  }

  // フォームをリセット
  document.getElementById('createPlanForm')?.reset();

  // モーダルを表示
  const createPlanModal = new bootstrap.Modal(document.getElementById('createPlanModal'));
  createPlanModal.show();
}

/**
 * 新規プランを作成する関数
 * @param {Object} planData - 作成するプランデータ
 */
function createPlan(planData) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';

  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('新規プランを作成:', planData);

  // モーダルを閉じる
  const createPlanModal = bootstrap.Modal.getInstance(document.getElementById('createPlanModal'));
  if (createPlanModal) {
    createPlanModal.hide();
  }

  // 成功メッセージを表示
  showAlert('新規プランを作成しました', 'success');

  // ページをリロードして新しいプランを表示
  // 実際のアプリケーションでは、APIからデータを再取得する処理に置き換える
  setTimeout(() => {
    window.location.reload();
  }, 1500);

  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'createPlan',
      planData: planData
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // モーダルを閉じる
      const createPlanModal = bootstrap.Modal.getInstance(document.getElementById('createPlanModal'));
      if (createPlanModal) {
        createPlanModal.hide();
      }
      
      // 成功メッセージを表示
      showAlert('新規プランを作成しました', 'success');
      
      // ページをリロードして新しいプランを表示
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      console.error('Error:', data.error);
      showAlert('プランの作成中にエラーが発生しました', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert('プランの作成中にエラーが発生しました', 'danger');
  });
  */
}

/**
 * プラン編集ボタンのイベントハンドラーを設定する関数
 */
function setupPlanEditButtons() {
  // プラン編集ボタンのイベントリスナーを設定
  document.querySelectorAll('button[data-plan-id]').forEach(button => {
    button.addEventListener('click', function () {
      const planId = this.getAttribute('data-plan-id');
      showEditPlanModal(planId);
    });
  });
}

/**
 * イベントリスナーの設定関数を拡張
 */
function setupAdditionalEventListeners() {
  // 新規プラン作成ボタンのイベントハンドラーを設定
  setupCreatePlanButton();

  // プラン編集ボタンのイベントハンドラーを設定
  setupPlanEditButtons();
}

// DOMが完全に読み込まれた後に実行するイベントリスナーに追加
document.addEventListener('DOMContentLoaded', function () {
  // 既存の処理に加えて、追加のイベントリスナーを設定
  setupAdditionalEventListeners();
});
