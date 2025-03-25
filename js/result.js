/**
 * 看護記録AIアプリケーション - 結果表示スクリプト
 */

// DOMが完全に読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
  // Mermaidの初期化
  mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    securityLevel: 'loose',
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true
    }
  });
  
  // 患者データとアセスメント結果の取得
  const patientData = JSON.parse(localStorage.getItem('patientData')) || {};
  const assessmentResult = JSON.parse(localStorage.getItem('assessmentResult')) || {};
  
  // ユーザー情報の取得（ログイン状態の確認）
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || { subscriptionLevel: 'free' };
  
  // 患者情報サマリーの表示
  displayPatientSummary(patientData);
  
  // 結果の表示
  displayResults(assessmentResult, userInfo);
  
  // ボタンイベントの設定
  setupButtonEvents(patientData, assessmentResult);
});

/**
 * 患者情報サマリーを表示する関数
 */
function displayPatientSummary(patientData) {
  // 患者アイコン
  const patientIconSummary = document.getElementById('patientIconSummary');
  if (patientData.patientIcon && patientData.patientIcon !== 'img/default-patient.png') {
    patientIconSummary.src = patientData.patientIcon;
  }
  
  // 基本情報
  document.getElementById('patientNameSummary').textContent = patientData.name || '--';
  document.getElementById('genderSummary').textContent = patientData.gender || '--';
  document.getElementById('ageSummary').textContent = patientData.age || '--';
  document.getElementById('currentDiseaseSummary').textContent = patientData.currentDisease || '--';
  document.getElementById('careLevelSummary').textContent = patientData.careLevel || '--';
  document.getElementById('keyPersonSummary').textContent = patientData.keyPerson || '--';
}

/**
 * アセスメント結果、関連図、看護計画を表示する関数
 */
function displayResults(assessmentResult, userInfo) {
  // アセスメント結果の表示
  const assessmentContent = document.getElementById('assessmentContent');
  if (assessmentResult.success && assessmentResult.assessment) {
    assessmentContent.innerHTML = formatTextWithLineBreaks(assessmentResult.assessment);
  } else {
    assessmentContent.innerHTML = '<div class="alert alert-danger">アセスメント結果の取得に失敗しました。</div>';
  }
  
  // 関連図の表示（サブスクリプションレベルに応じて制限）
  const diagramContent = document.getElementById('diagramContent');
  const premiumLockMessage = document.getElementById('premiumLockMessage');
  
  if (userInfo.subscriptionLevel === 'free') {
    // 無料ユーザーの場合はロックメッセージを表示
    premiumLockMessage.style.display = 'block';
    diagramContent.innerHTML = '<div class="premium-lock"><div id="mermaidDiagram" class="mermaid">graph TD\n  A[現病名] --> B[症状]\n  B --> C[看護問題]</div></div>';
  } else {
    // プレミアムユーザーの場合は関連図を表示
    premiumLockMessage.style.display = 'none';
    if (assessmentResult.success && assessmentResult.mermaidCode) {
      diagramContent.innerHTML = `<div id="mermaidDiagram" class="mermaid">${assessmentResult.mermaidCode}</div>`;
      // Mermaidの再レンダリング
      setTimeout(() => {
        mermaid.init(undefined, document.querySelector('.mermaid'));
      }, 100);
    } else {
      diagramContent.innerHTML = '<div class="alert alert-danger">関連図の生成に失敗しました。</div>';
    }
  }
  
  // 看護計画の表示
  const nursingPlanContent = document.getElementById('nursingPlanContent');
  if (assessmentResult.success && assessmentResult.nursingPlan) {
    const plan = assessmentResult.nursingPlan;
    let planHtml = '';
    
    // 長期目標
    planHtml += '<div class="mb-4"><h3 class="h5 mb-3">長期目標</h3>';
    planHtml += `<div class="p-3 bg-light rounded">${formatTextWithLineBreaks(plan.longTermGoals)}</div></div>`;
    
    // 短期目標
    planHtml += '<div class="mb-4"><h3 class="h5 mb-3">短期目標</h3>';
    planHtml += `<div class="p-3 bg-light rounded">${formatTextWithLineBreaks(plan.shortTermGoals)}</div></div>`;
    
    // O-P（観察計画）
    planHtml += '<div class="mb-4"><h3 class="h5 mb-3">O-P（観察計画）</h3>';
    planHtml += `<div class="p-3 bg-light rounded">${formatTextWithLineBreaks(plan.observationPlan)}</div></div>`;
    
    // T-P（実施計画）
    planHtml += '<div class="mb-4"><h3 class="h5 mb-3">T-P（実施計画）</h3>';
    planHtml += `<div class="p-3 bg-light rounded">${formatTextWithLineBreaks(plan.treatmentPlan)}</div></div>`;
    
    // E-P（教育計画）
    planHtml += '<div class="mb-4"><h3 class="h5 mb-3">E-P（教育計画）</h3>';
    planHtml += `<div class="p-3 bg-light rounded">${formatTextWithLineBreaks(plan.educationPlan)}</div></div>`;
    
    nursingPlanContent.innerHTML = planHtml;
  } else {
    nursingPlanContent.innerHTML = '<div class="alert alert-danger">看護計画の生成に失敗しました。</div>';
  }
}

/**
 * テキストを改行を保持してHTMLに変換する関数
 */
function formatTextWithLineBreaks(text) {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
}

/**
 * ボタンイベントを設定する関数
 */
function setupButtonEvents(patientData, assessmentResult) {
  // 編集ボタン
  const editButton = document.getElementById('editButton');
  editButton.addEventListener('click', function() {
    window.location.href = 'patient-form.html';
  });
  
  // 保存ボタン
  const saveButton = document.getElementById('saveButton');
  saveButton.addEventListener('click', function() {
    // ログイン状態の確認
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.userId) {
      // 未ログインの場合はログインを促す
      if (confirm('履歴を保存するにはログインが必要です。ログインページに移動しますか？')) {
        window.location.href = 'login.html?redirect=result.html';
      }
      return;
    }
    
    // 保存処理（実際のデプロイ時にはGASへのリクエストを実装）
    saveToHistory(patientData, assessmentResult, userInfo.userId);
  });
  
  // 印刷ボタン
  const printButton = document.getElementById('printButton');
  printButton.addEventListener('click', function() {
    window.print();
  });
  
  // 共有ボタン
  const shareButton = document.getElementById('shareButton');
  shareButton.addEventListener('click', function() {
    // 共有機能（実際のデプロイ時には実装）
    alert('共有機能は現在開発中です。');
  });
}

/**
 * 履歴に保存する関数
 */
function saveToHistory(patientData, assessmentResult, userId) {
  // 実際のデプロイ時にはGASのWebアプリURLを設定
  const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
  
  // 開発用のモック処理（実際のデプロイ時には削除）
  console.log('履歴保存:', { patientData, assessmentResult, userId });
  
  // 開発用のモック処理：保存成功メッセージ
  alert('履歴に保存しました。');
  
  // 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え
  /*
  fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'savePatientData',
      patientData: {
        ...patientData,
        assessment: assessmentResult.assessment,
        relationshipDiagram: assessmentResult.mermaidCode,
        nursingPlan: assessmentResult.nursingPlan
      },
      userId: userId
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('履歴に保存しました。');
    } else {
      alert('保存に失敗しました: ' + data.error);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('通信エラーが発生しました。再度お試しください。');
  });
  */
}
