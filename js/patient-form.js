/**
 * AI看護記録アプリケーション - 患者情報フォームスクリプト
 */

// DOMが完全に読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
  // 要素の取得
  const patientForm = document.getElementById('patientForm');
  const birthDateInput = document.getElementById('birthDate');
  const ageDisplay = document.getElementById('ageDisplay');
  const familyStructureSelect = document.getElementById('familyStructure');
  const familyStructureOtherContainer = document.getElementById('familyStructureOtherContainer');
  const iconUpload = document.getElementById('iconUpload');
  const patientIcon = document.getElementById('patientIcon');
  const submitButton = document.getElementById('submitButton');
  const submitSpinner = document.getElementById('submitSpinner');
  const headerContainer = document.querySelector("#header");
  // ローカルストレージからユーザー情報を取得
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

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

  // 患者アイコンのアップロード処理
  iconUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      // ファイルサイズチェック (5MB以下)
      if (file.size > 5 * 1024 * 1024) {
        alert('ファイルサイズは5MB以下にしてください');
        return;
      }
      
      // 画像ファイル形式チェック
      if (!file.type.match('image.*')) {
        alert('画像ファイルを選択してください');
        return;
      }
      
      // FileReaderでプレビュー表示
      const reader = new FileReader();
      reader.onload = function(e) {
        patientIcon.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // 患者アイコン選択モーダル
  const modal = document.getElementById("iconSelectModal");
  const openModal = document.getElementById("openIconModal");
  const closeModal = document.getElementById("closeModal");
  const iconOptions = document.querySelectorAll(".icon-option");

  openModal.addEventListener("click", function () {
    modal.style.display = "block";
    });

  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
    });

    iconOptions.forEach(icon => {
    icon.addEventListener("click", function () {
      patientIcon.src = this.getAttribute("data-src");
      modal.style.display = "none";
    });
    });

  window.addEventListener("click", function (event) {
      if (event.target === modal) {
    modal.style.display = "none";
      }
    });

  // 生年月日から年齢を自動計算
  birthDateInput.addEventListener('change', calculateAge);

  function calculateAge() {
    const birthDate = new Date(birthDateInput.value);
    if (isNaN(birthDate.getTime())) {
      ageDisplay.textContent = '年齢: --歳';
      return;
    }
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    ageDisplay.textContent = `年齢: ${age}歳`;
  }

  // 家族構成「その他」選択時の追加入力欄表示制御
  familyStructureSelect.addEventListener('change', function() {
    if (this.value === 'その他') {
      familyStructureOtherContainer.style.display = 'block';
    } else {
      familyStructureOtherContainer.style.display = 'none';
    }
  });

  // フォームのバリデーション設定
  patientForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (!patientForm.checkValidity()) {
      event.stopPropagation();
      patientForm.classList.add('was-validated');
      return;
    }
    
    // フォーム送信処理
    submitForm();
  });

  // フォームデータの送信処理
  function submitForm() {
    // 送信ボタンの状態を変更（ローディング表示）
    submitButton.disabled = true;
    submitSpinner.classList.remove('d-none');
    
    // フォームデータの収集
    const patientData = {
      name: document.getElementById('patientName').value,
      gender: document.querySelector('input[name="gender"]:checked').value,
      birthDate: document.getElementById('birthDate').value,
      age: parseInt(ageDisplay.textContent.match(/\d+/)[0]),
      familyStructure: getFamilyStructureValue(),
      keyPerson: document.getElementById('keyPerson').value,
      careLevel: document.getElementById('careLevel').value,
      currentDisease: document.getElementById('currentDisease').value,
      medicalHistory: document.getElementById('medicalHistory').value,
      surgicalHistory: document.getElementById('surgicalHistory').value,
      medications: document.getElementById('medications').value,
      adlEating: document.getElementById('adlEating').value,
      adlToileting: document.getElementById('adlToileting').value,
      adlMobility: document.getElementById('adlMobility').value,
      otherInfo: document.getElementById('otherInfo').value,
      patientIcon: patientIcon.src,
      userInfo: userInfo
    };
    
    // Google Apps Script APIにデータを送信
    sendToGAS(patientData);
  }

  // 家族構成の値を取得（「その他」の場合は詳細も含める）
  function getFamilyStructureValue() {
    const value = familyStructureSelect.value;
    if (value === 'その他') {
      const otherValue = document.getElementById('familyStructureOther').value;
      return otherValue ? `その他（${otherValue}）` : 'その他';
    }
    return value;
  }

  // Google Apps Scriptにデータを送信する関数
  function sendToGAS(patientData) {
    // 実際のデプロイ時にはGASのWebアプリURLを設定
    const gasUrl = 'https://script.google.com/macros/s/AKfycbwmfpRmRYc5tlBTy0PydIpblV04SGLxlBEJiygr7PgwRmYcJQXi3l3WyAiZukzb9YXd7w/exec';
    
    // 開発用のモック処理（実際のデプロイ時には削除）
    console.log('患者データ送信:', patientData);
    
    // 開発用のモック処理：3秒後に結果ページへリダイレクト
    setTimeout(function() {
      // 実際のデプロイ時にはこの部分を実際のAPIリクエストに置き換え

      fetch(gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify({
          action: "generateAssessment",
          patientData: patientData || {}
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // 成功時の処理
          localStorage.setItem('patientData', JSON.stringify(patientData));
          localStorage.setItem('assessmentResult', JSON.stringify({
            success: data.success,
            assessment: data.assessment,
            error: data.error
          }));

          // usageCountを更新（resultに基づいて）
          updateUsageInfo(data.result, true); //（初回なので true）

          // 看護計画の作成
          const assessmentResultStr = localStorage.getItem('assessmentResult').trim();
          const patientDataStr = localStorage.getItem('patientData');

          
          if (assessmentResultStr && patientDataStr) {
            const assessmentResult = JSON.parse(assessmentResultStr);
            const assessment = assessmentResult.assessment || {};
            const patientData = JSON.parse(patientDataStr);

            fetch(gasUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'text/plain'
              },
              body: JSON.stringify({
                action: "generateNursingPlan",
                assessmentData: {
                  assessment: assessment,
                  patientData: patientData
                }
              })
            })
              .then(response => response.json())
              .then(planData => {
                if (planData.success) {

                  // usageCountを更新（resultに基づいて）
                  updateUsageInfo(planData.result); // usageLimit は更新しない（2回目）

                  localStorage.setItem('nursingPlan', JSON.stringify({
                    success: planData.success,
                    nursingPlan: planData.nursingPlan,
                    result: planData.result
                  })); // 看護計画を保存
                } else {
                  console.warn('看護計画の生成に失敗:', planData.error);
                  alert('看護計画の生成に失敗しました: ' + planData.error);
                }

                // 最後に結果画面へ遷移
                window.location.href = 'result.html';
              })
            .catch(error => {
              console.error('看護計画APIエラー:', error);
              alert('看護計画の生成中に通信エラーが発生しました。');
              window.location.href = 'result.html'; // 最低限の遷移は行う
            });
          };

          // 関連図の作成
          if (assessmentResultStr && patientDataStr) {
            const assessmentResult = JSON.parse(assessmentResultStr);
            const assessment = assessmentResult.assessment || {};
            const patientData = JSON.parse(patientDataStr);

            fetch(gasUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'text/plain'
              },
              body: JSON.stringify({
                action: "generateRelationshipDiagram",
                assessmentData: {
                  assessment: assessment,
                  patientData: patientData
                }
              })
            })
              .then(response => response.json())
              .then(relationshipDiagramData => {
                if (relationshipDiagramData.success) {

                  // usageCountを更新（resultに基づいて）
                  updateUsageInfo(relationshipDiagramData.result); // usageLimit は更新しない（3回目）

                  localStorage.setItem('relationshipDiagram', JSON.stringify({
                    success: relationshipDiagramData.success,
                    mermaidCode: relationshipDiagramData.mermaidCode,
                    result: relationshipDiagramData.result
                  })); // 関連図を保存
                } else {
                  console.warn('関連図の生成に失敗:', relationshipDiagramData.error);
                  alert('関連図の生成に失敗しました: ' + relationshipDiagramData.error);
                }

                // 最後に結果画面へ遷移
                // window.location.href = 'result.html';
              })
              .catch(error => {
                console.error('関連図APIエラー:', error);
                alert('関連図の生成中に通信エラーが発生しました。');
                window.location.href = 'result.html'; // 最低限の遷移は行う
              });
          };


        } else {
          // エラー時の処理
          alert('エラーが発生しました: ' + data.error);
          submitButton.disabled = false;
          submitSpinner.classList.add('d-none');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('通信エラーが発生しました。再度お試しください。');
        submitButton.disabled = false;
        submitSpinner.classList.add('d-none');
      });

      // 開発用のモック処理（実際のデプロイ時には削除）
      console.log('患者データ送信完了！');
      
    }
    , 3000);
  }
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

/**
 * usageCount を result に基づいて更新し、usageLimit.remainingToday を1デクリメントして保存
 * @param {Object} result usageCountに反映する対象（例: data.result や planData.result）
 * @param {boolean} decrementDailyLimit usageLimit.remainingTodayを減らすか（初回のみ true）
 */
function updateUsageInfo(result, decrementDailyLimit = false) {
  const userInfoStr = localStorage.getItem('userInfo');
  if (!userInfoStr) return;

  const userInfo = JSON.parse(userInfoStr);
  const usage = userInfo.usageCount || {};

  ['assessment', 'relationshipDiagram', 'nursingPlan'].forEach(key => {
    if (result[key] && typeof usage[key] === 'number') {
      usage[key] += 1;
    }
  });

  userInfo.usageCount = usage;

  if (decrementDailyLimit && typeof userInfo.usageLimit?.remainingToday === 'number') {
    userInfo.usageLimit.remainingToday = Math.max(0, userInfo.usageLimit.remainingToday - 1);
  }

  localStorage.setItem('userInfo', JSON.stringify(userInfo));
}


