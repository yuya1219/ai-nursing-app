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
  if (!userInfo || userInfo.role !== 'admin') {
    window.location.href = 'login.html?redirect=admin.html';
    return;
  }
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
  // 月間利用回数チャート
  const monthlyUsageCtx = document.getElementById('monthlyUsageChart').getContext('2d');
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
  const planDistributionCtx = document.getElementById('planDistributionChart').getContext('2d');
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
  const featureUsageCtx = document.getElementById('featureUsageChart').getContext('2d');
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
  const revenueCtx = document.getElementById('revenueChart').getContext('2d');
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
  const userSearchForm = document.getElementById('userSearchForm');
  if (userSearchForm) {
    userSearchForm.addEventListener('submit', function(e) {
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
