/**
 * AI看護記録アプリケーション - 履歴管理スクリプト
 */

// DOMが完全に読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
  // ログイン状態の確認
  checkLoginStatus();
  
  // 履歴データの読み込み
  loadHistoryData();
  
  // イベントリスナーの設定
  setupEventListeners();
});

/**
 * ログイン状態を確認する関数
 */
function checkLoginStatus() {
  // ローカルストレージからユーザー情報を取得
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  if (userInfo && userInfo.userId) {
    // ログイン済みの場合
    document.getElementById('userName').textContent = userInfo.name || 'ユーザー';
    
    // サブスクリプションレベルに応じた表示調整
    if (userInfo.subscriptionLevel === 'free') {
      document.getElementById('historyLimitAlert').classList.remove('d-none');
    }
  } else {
    // 未ログインの場合はログインページにリダイレクト
    window.location.href = 'login.html?redirect=history.html';
  }
}

/**
 * 履歴データを読み込む関数
 */
function loadHistoryData() {
  // ローカルストレージからユーザー情報を取得
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  if (!userInfo || !userInfo.userId) {
    return;
  }
  
  // 検索フィルターの取得
  const searchQuery = document.getElementById('searchInput').value;
  const sortFilter = document.getElementById('sortFilter').value;
  const timeFilter = document.getElementById('timeFilter').value;
  
  // ローディング表示
  showLoading();
  
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモックデータ（実際のデプロイ時には削除）
  setTimeout(function() {
    // ローディング非表示
    hideLoading();
    
    // モックデータ
    const mockHistoryData = [
      {
        id: 'hist_001',
        patientName: '山田 太郎',
        patientAge: 68,
        patientGender: '男性',
        diagnosis: '2型糖尿病、高血圧',
        createdAt: '2025-03-24T10:30:00',
        updatedAt: '2025-03-24T10:30:00',
        hasAssessment: true,
        hasDiagram: true,
        hasNursingPlan: true,
        thumbnailUrl: 'img/patient-icon-male.png'
      },
      {
        id: 'hist_002',
        patientName: '佐藤 花子',
        patientAge: 75,
        patientGender: '女性',
        diagnosis: '脳梗塞後遺症、高血圧',
        createdAt: '2025-03-23T14:15:00',
        updatedAt: '2025-03-23T15:20:00',
        hasAssessment: true,
        hasDiagram: true,
        hasNursingPlan: true,
        thumbnailUrl: 'img/patient-icon-female.png'
      },
      {
        id: 'hist_003',
        patientName: '鈴木 一郎',
        patientAge: 82,
        patientGender: '男性',
        diagnosis: '慢性心不全、慢性腎臓病',
        createdAt: '2025-03-22T09:45:00',
        updatedAt: '2025-03-22T09:45:00',
        hasAssessment: true,
        hasDiagram: true,
        hasNursingPlan: true,
        thumbnailUrl: 'img/patient-icon-male.png'
      },
      {
        id: 'hist_004',
        patientName: '田中 美咲',
        patientAge: 45,
        patientGender: '女性',
        diagnosis: '乳がん術後、不安障害',
        createdAt: '2025-03-20T16:30:00',
        updatedAt: '2025-03-21T10:15:00',
        hasAssessment: true,
        hasDiagram: true,
        hasNursingPlan: true,
        thumbnailUrl: 'img/patient-icon-female.png'
      },
      {
        id: 'hist_005',
        patientName: '伊藤 健太',
        patientAge: 58,
        patientGender: '男性',
        diagnosis: '肺炎、COPD',
        createdAt: '2025-03-18T11:20:00',
        updatedAt: '2025-03-18T11:20:00',
        hasAssessment: true,
        hasDiagram: true,
        hasNursingPlan: true,
        thumbnailUrl: 'img/patient-icon-male.png'
      },
      {
        id: 'hist_006',
        patientName: '渡辺 直子',
        patientAge: 72,
        patientGender: '女性',
        diagnosis: '関節リウマチ、骨粗鬆症',
        createdAt: '2025-03-15T13:40:00',
        updatedAt: '2025-03-15T13:40:00',
        hasAssessment: true,
        hasDiagram: true,
        hasNursingPlan: true,
        thumbnailUrl: 'img/patient-icon-female.png'
      }
    ];
    
    // 検索フィルターの適用
    let filteredData = mockHistoryData;
    
    // 検索クエリによるフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.patientName.toLowerCase().includes(query) || 
        item.diagnosis.toLowerCase().includes(query)
      );
    }
    
    // 時間フィルターによるフィルタリング
    if (timeFilter !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (timeFilter) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 30);
          break;
        case 'year':
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filteredData = filteredData.filter(item => new Date(item.createdAt) >= startDate);
    }
    
    // ソートフィルターによるソート
    switch (sortFilter) {
      case 'date_desc':
        filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'date_asc':
        filteredData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'name_asc':
        filteredData.sort((a, b) => a.patientName.localeCompare(b.patientName));
        break;
      case 'name_desc':
        filteredData.sort((a, b) => b.patientName.localeCompare(a.patientName));
        break;
    }
    
    // 履歴リストの表示
    displayHistoryList(filteredData);
    
    // ページネーションの設定
    setupPagination(filteredData.length);
  }, 1000);
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  // APIリクエスト
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getHistoryList',
      userId: userInfo.userId,
      searchQuery: searchQuery,
      sortFilter: sortFilter,
      timeFilter: timeFilter,
      page: 1,
      limit: 10
    })
  })
  .then(response => response.json())
  .then(data => {
    // ローディング非表示
    hideLoading();
    
    if (data.success) {
      // 履歴リストの表示
      displayHistoryList(data.historyList);
      
      // ページネーションの設定
      setupPagination(data.totalCount);
    } else {
      console.error('Error:', data.error);
      showError('履歴データの取得に失敗しました。');
    }
  })
  .catch(error => {
    // ローディング非表示
    hideLoading();
    
    console.error('Error:', error);
    showError('通信エラーが発生しました。');
  });
  */
}

/**
 * 履歴リストを表示する関数
 * 
 * @param {Array} historyList 履歴データの配列
 */
function displayHistoryList(historyList) {
  const historyListElement = document.getElementById('historyList');
  
  // リストをクリア
  historyListElement.innerHTML = '';
  
  if (historyList.length === 0) {
    // 履歴がない場合
    historyListElement.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-history fa-4x text-muted mb-3"></i>
        <h4 class="text-muted">履歴がありません</h4>
        <p class="text-muted">患者情報を入力して、看護記録を作成しましょう。</p>
        <a href="patient-form.html" class="btn btn-primary mt-3">
          <i class="fas fa-plus me-2"></i>新規作成
        </a>
      </div>
    `;
    return;
  }
  
  // 履歴カードを生成
  historyList.forEach(history => {
    const createdDate = new Date(history.createdAt);
    const formattedDate = `${createdDate.getFullYear()}/${(createdDate.getMonth() + 1).toString().padStart(2, '0')}/${createdDate.getDate().toString().padStart(2, '0')} ${createdDate.getHours().toString().padStart(2, '0')}:${createdDate.getMinutes().toString().padStart(2, '0')}`;
    
    const historyCard = document.createElement('div');
    historyCard.className = 'col-md-6 col-lg-4 mb-4';
    historyCard.innerHTML = `
      <div class="card h-100 border-0 shadow-sm history-card" data-history-id="${history.id}">
        <div class="card-body">
          <div class="d-flex align-items-center mb-3">
            <img src="${history.thumbnailUrl}" alt="${history.patientName}" class="rounded-circle me-3" width="50" height="50">
            <div>
              <h5 class="card-title mb-1">${history.patientName}</h5>
              <p class="card-text text-muted mb-0">${history.patientAge}歳 ${history.patientGender}</p>
            </div>
          </div>
          <p class="card-text mb-2"><strong>現病名:</strong> ${history.diagnosis}</p>
          <p class="card-text mb-3"><strong>作成日時:</strong> ${formattedDate}</p>
          <div class="d-flex mb-3">
            <span class="badge ${history.hasAssessment ? 'bg-success' : 'bg-secondary'} me-2">アセスメント</span>
            <span class="badge ${history.hasDiagram ? 'bg-success' : 'bg-secondary'} me-2">関連図</span>
            <span class="badge ${history.hasNursingPlan ? 'bg-success' : 'bg-secondary'}">看護計画</span>
          </div>
          <div class="d-flex justify-content-between">
            <button class="btn btn-sm btn-outline-primary view-history-btn" data-history-id="${history.id}">
              <i class="fas fa-eye me-1"></i>閲覧
            </button>
            <button class="btn btn-sm btn-outline-success edit-history-btn" data-history-id="${history.id}">
              <i class="fas fa-edit me-1"></i>編集
            </button>
            <button class="btn btn-sm btn-outline-danger delete-history-btn" data-history-id="${history.id}" data-patient-name="${history.patientName}" data-created-date="${formattedDate}">
              <i class="fas fa-trash-alt me-1"></i>削除
            </button>
          </div>
        </div>
      </div>
    `;
    
    historyListElement.appendChild(historyCard);
  });
  
  // 履歴カードのイベントリスナーを設定
  setupHistoryCardListeners();
}

/**
 * ページネーションを設定する関数
 * 
 * @param {number} totalCount 総履歴数
 * @param {number} currentPage 現在のページ番号
 * @param {number} limit 1ページあたりの表示件数
 */
function setupPagination(totalCount, currentPage = 1, limit = 10) {
  const paginationElement = document.getElementById('historyPagination');
  
  // ページネーションをクリア
  paginationElement.innerHTML = '';
  
  // 総ページ数を計算
  const totalPages = Math.ceil(totalCount / limit);
  
  if (totalPages <= 1) {
    // ページが1ページ以下の場合はページネーションを表示しない
    return;
  }
  
  // 前のページへのリンク
  const prevLi = document.createElement('li');
  prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  prevLi.innerHTML = `
    <a class="page-link" href="#" aria-label="Previous" ${currentPage === 1 ? 'tabindex="-1" aria-disabled="true"' : ''}>
      <span aria-hidden="true">&laquo;</span>
    </a>
  `;
  paginationElement.appendChild(prevLi);
  
  // ページ番号のリンク
  for (let i = 1; i <= totalPages; i++) {
    const pageLi = document.createElement('li');
    pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
    pageLi.innerHTML = `
      <a class="page-link" href="#" data-page="${i}">${i}</a>
    `;
    paginationElement.appendChild(pageLi);
  }
  
  // 次のページへのリンク
  const nextLi = document.createElement('li');
  nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  nextLi.innerHTML = `
    <a class="page-link" href="#" aria-label="Next" ${currentPage === totalPages ? 'tabindex="-1" aria-disabled="true"' : ''}>
      <span aria-hidden="true">&raquo;</span>
    </a>
  `;
  paginationElement.appendChild(nextLi);
  
  // ページネーションのイベントリスナーを設定
  setupPaginationListeners();
}

/**
 * 履歴カードのイベントリスナーを設定する関数
 */
function setupHistoryCardListeners() {
  // 閲覧ボタンのイベントリスナー
  const viewButtons = document.querySelectorAll('.view-history-btn');
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      const historyId = this.getAttribute('data-history-id');
      viewHistory(historyId);
    });
  });
  
  // 編集ボタンのイベントリスナー
  const editButtons = document.querySelectorAll('.edit-history-btn');
  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const historyId = this.getAttribute('data-history-id');
      editHistory(historyId);
    });
  });
  
  // 削除ボタンのイベントリスナー
  const deleteButtons = document.querySelectorAll('.delete-history-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const historyId = this.getAttribute('data-history-id');
      const patientName = this.getAttribute('data-patient-name');
      const createdDate = this.getAttribute('data-created-date');
      showDeleteConfirmModal(historyId, patientName, createdDate);
    });
  });
}

/**
 * ページネーションのイベントリスナーを設定する関数
 */
function setupPaginationListeners() {
  // ページ番号のイベントリスナー
  const pageLinks = document.querySelectorAll('.page-link[data-page]');
  pageLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const page = parseInt(this.getAttribute('data-page'));
      changePage(page);
    });
  });
  
  // 前のページへのリンクのイベントリスナー
  const prevLink = document.querySelector('.page-link[aria-label="Previous"]');
  if (prevLink) {
    prevLink.addEventListener('click', function(event) {
      event.preventDefault();
      if (!this.parentElement.classList.contains('disabled')) {
        const currentPage = parseInt(document.querySelector('.page-item.active .page-link').getAttribute('data-page'));
        changePage(currentPage - 1);
      }
    });
  }
  
  // 次のページへのリンクのイベントリスナー
  const nextLink = document.querySelector('.page-link[aria-label="Next"]');
  if (nextLink) {
    nextLink.addEventListener('click', function(event) {
      event.preventDefault();
      if (!this.parentElement.classList.contains('disabled')) {
        const currentPage = parseInt(document.querySelector('.page-item.active .page-link').getAttribute('data-page'));
        changePage(currentPage + 1);
      }
    });
  }
}

/**
 * ページを変更する関数
 * 
 * @param {number} page ページ番号
 */
function changePage(page) {
  // ローカルストレージからユーザー情報を取得
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  if (!userInfo || !userInfo.userId) {
    return;
  }
  
  // 検索フィルターの取得
  const searchQuery = document.getElementById('searchInput').value;
  const sortFilter = document.getElementById('sortFilter').value;
  const timeFilter = document.getElementById('timeFilter').value;
  
  // ローディング表示
  showLoading();
  
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモックデータ（実際のデプロイ時には削除）
  setTimeout(function() {
    // ローディング非表示
    hideLoading();
    
    // モックデータ
    const mockHistoryData = [
      {
        id: 'hist_007',
        patientName: '高橋 雄太',
        patientAge: 42,
        patientGender: '男性',
        diagnosis: '急性胃炎、不眠症',
        createdAt: '2025-03-10T09:15:00',
        updatedAt: '2025-03-10T09:15:00',
        hasAssessment: true,
        hasDiagram: true,
        hasNursingPlan: true,
        thumbnailUrl: 'img/patient-icon-male.png'
      },
      {
        id: 'hist_008',
        patientName: '小林 真理',
        patientAge: 65,
        patientGender: '女性',
        diagnosis: '大腸がん術後、貧血',
        createdAt: '2025-03-05T16:20:00',
        updatedAt: '2025-03-05T16:20:00',
        hasAssessment: true,
        hasDiagram: true,
        hasNursingPlan: true,
        thumbnailUrl: 'img/patient-icon-female.png'
      },
      {
        id: 'hist_009',
        patientName: '加藤 健一',
        patientAge: 78,
        patientGender: '男性',
        diagnosis: 'パーキンソン病、高血圧',
        createdAt: '2025-03-01T11:30:00',
        updatedAt: '2025-03-01T11:30:00',
        hasAssessment: true,
        hasDiagram: true,
        hasNursingPlan: true,
        thumbnailUrl: 'img/patient-icon-male.png'
      }
    ];
    
    // 履歴リストの表示
    displayHistoryList(mockHistoryData);
    
    // ページネーションの設定
    setupPagination(12, page);
  }, 1000);
  
  /* 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
// APIリクエスト
fetch(gasUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'getHistory',
    userId: userId,
    options: {
      sort: sortBy,
      order: sortOrder,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
      search: searchTerm,
      tag: selectedTag,
      favorite: favoriteFilter
    }
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
    // 履歴データを表示
    displayHistoryItems(data.histories);
    
    // ページネーションを更新
    updatePagination(data.totalItems, currentPage, itemsPerPage);
    
    // タグクラウドを更新
    updateTagCloud(data.tags);
    
    // 読み込み中表示を非表示
    document.getElementById('loadingSpinner').style.display = 'none';
    
    // 履歴がない場合のメッセージを表示
    if (data.histories.length === 0) {
      const historyContainer = document.getElementById('historyContainer');
      historyContainer.innerHTML = '<div class="alert alert-info">履歴がありません。患者情報を入力して看護記録を作成してください。</div>';
    }
  } else {
    // エラーメッセージを表示
    showAlert(data.error || '履歴の取得に失敗しました', 'danger');
    document.getElementById('loadingSpinner').style.display = 'none';
  }
})
.catch(error => {
  console.error('履歴取得エラー:', error);
  showAlert('履歴の取得中にエラーが発生しました: ' + error.message, 'danger');
  document.getElementById('loadingSpinner').style.display = 'none';
});
*/
}
