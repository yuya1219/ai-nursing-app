/**
 * AI看護記録アプリケーション - 看護計画生成スクリプト
 */

// 看護計画生成のためのサンプルデータ構造
const sampleNursingPlanData = {
  // 患者基本情報
  patient: {
    name: "山田 太郎",
    age: 65,
    gender: "男性",
    currentDisease: "2型糖尿病",
    careLevel: "要支援1"
  },
  
  // アセスメント結果（要約）
  assessmentSummary: {
    mainProblems: [
      "血糖コントロール不良",
      "食事管理の知識不足",
      "運動不足",
      "足部のしびれ（末梢神経障害）"
    ],
    strengths: [
      "治療への意欲がある",
      "家族のサポートがある",
      "認知機能は良好"
    ]
  },
  
  // 看護計画
  nursingPlan: {
    longTermGoals: "・血糖値が安定し（空腹時血糖値 80-130mg/dL、HbA1c 7.0%未満）、合併症の進行が予防できる\n・自己管理能力が向上し、健康的な生活習慣を維持できる",
    
    shortTermGoals: "・1週間以内に食事管理の重要性を理解し、食事記録をつけることができる\n・2週間以内に適切な血糖測定と記録ができるようになる\n・2週間以内に毎日10分以上の運動を実施できる",
    
    observationPlan: "・毎日の血糖値測定結果の確認（朝食前、朝食後2時間）\n・食事内容と摂取量の確認\n・運動実施状況の確認\n・足部の状態（しびれ、潰瘍、変色など）の観察\n・低血糖症状の有無の確認\n・水分摂取量の確認",
    
    treatmentPlan: "・医師の指示に基づく投薬管理の支援\n・食事指導（カロリー計算、栄養バランス）の実施\n・適切な運動方法の指導と実施支援\n・フットケアの実施と指導\n・水分摂取の促進\n・必要に応じて血糖測定の介助",
    
    educationPlan: "・糖尿病の病態と合併症についての説明\n・血糖測定の方法と記録の仕方の指導\n・食事療法の重要性と具体的な食品選択の指導\n・運動療法の効果と適切な運動方法の指導\n・低血糖症状とその対処法の説明\n・フットケアの重要性と方法の指導\n・服薬管理の指導"
  }
};

/**
 * アセスメントデータから看護計画を生成する関数
 * 
 * @param {Object} assessmentData アセスメントデータ
 * @return {Object} 看護計画データ
 */
function generateNursingPlan(assessmentData) {
  // 実際の実装では、アセスメントデータをパースして看護計画を生成
  // ここではサンプルデータを使用
  
  // 実際のデプロイ時にはChatGPT APIを呼び出す
  /*
  const prompt = createNursingPlanPrompt(assessmentData);
  const response = callChatGPTAPI(prompt);
  const nursingPlan = parseNursingPlanResponse(response);
  return nursingPlan;
  */
  
  return sampleNursingPlanData.nursingPlan;
}

/**
 * 看護計画生成用のプロンプトを作成する関数
 * 
 * @param {Object} assessmentData アセスメントデータ
 * @return {string} プロンプト
 */
function createNursingPlanPrompt(assessmentData) {
  // 患者情報とアセスメント結果からプロンプトを作成
  const prompt = `
以下の患者情報とアセスメント結果に基づいて、具体的な看護計画を立案してください。
看護計画は以下の項目に分けて作成してください:

1. 長期目標（入院期間全体または3ヶ月程度の期間で達成すべき目標）
2. 短期目標（1週間から2週間程度で達成すべき目標）
3. O-P（観察計画）：何をどのように観察するか
4. T-P（実施計画）：どのようなケアを実施するか
5. E-P（教育計画）：患者や家族への指導内容

患者情報:
氏名: ${assessmentData.patient.name}
性別: ${assessmentData.patient.gender}
年齢: ${assessmentData.patient.age}歳
現病名: ${assessmentData.patient.currentDisease}
介護度: ${assessmentData.patient.careLevel}

アセスメント結果:
${assessmentData.assessment}

看護計画は具体的で測定可能なものにしてください。また、患者の個別性を考慮した内容にしてください。
`;

  return prompt;
}

/**
 * ChatGPT APIを呼び出す関数
 * 
 * @param {string} prompt プロンプト
 * @return {string} APIレスポンス
 */
function callChatGPTAPI(prompt) {
  // 実際のデプロイ時にはAPIキーを設定
  const apiKey = 'YOUR_API_KEY';
  
  // APIリクエストの設定
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'あなたは看護計画作成を支援する専門的なAIアシスタントです。医療・看護の専門知識に基づいて回答してください。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  };
  
  // 実際のデプロイ時にはfetchを使用してAPIを呼び出す
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
  const data = await response.json();
  return data.choices[0].message.content;
  */
  
  // 開発用のモックレスポンス
  return `
長期目標:
・血糖値が安定し（空腹時血糖値 80-130mg/dL、HbA1c 7.0%未満）、合併症の進行が予防できる
・自己管理能力が向上し、健康的な生活習慣を維持できる

短期目標:
・1週間以内に食事管理の重要性を理解し、食事記録をつけることができる
・2週間以内に適切な血糖測定と記録ができるようになる
・2週間以内に毎日10分以上の運動を実施できる

O-P（観察計画）:
・毎日の血糖値測定結果の確認（朝食前、朝食後2時間）
・食事内容と摂取量の確認
・運動実施状況の確認
・足部の状態（しびれ、潰瘍、変色など）の観察
・低血糖症状の有無の確認
・水分摂取量の確認

T-P（実施計画）:
・医師の指示に基づく投薬管理の支援
・食事指導（カロリー計算、栄養バランス）の実施
・適切な運動方法の指導と実施支援
・フットケアの実施と指導
・水分摂取の促進
・必要に応じて血糖測定の介助

E-P（教育計画）:
・糖尿病の病態と合併症についての説明
・血糖測定の方法と記録の仕方の指導
・食事療法の重要性と具体的な食品選択の指導
・運動療法の効果と適切な運動方法の指導
・低血糖症状とその対処法の説明
・フットケアの重要性と方法の指導
・服薬管理の指導
`;
}

/**
 * ChatGPT APIのレスポンスから看護計画を抽出する関数
 * 
 * @param {string} response APIレスポンス
 * @return {Object} 看護計画データ
 */
function parseNursingPlanResponse(response) {
  // レスポンスから各セクションを抽出
  const longTermGoalsMatch = response.match(/長期目標[：:]([\s\S]*?)(?=短期目標[：:]|$)/);
  const shortTermGoalsMatch = response.match(/短期目標[：:]([\s\S]*?)(?=O-P|観察計画[：:]|$)/);
  const observationPlanMatch = response.match(/(?:O-P|観察計画)[：:]([\s\S]*?)(?=T-P|実施計画[：:]|$)/);
  const treatmentPlanMatch = response.match(/(?:T-P|実施計画)[：:]([\s\S]*?)(?=E-P|教育計画[：:]|$)/);
  const educationPlanMatch = response.match(/(?:E-P|教育計画)[：:]([\s\S]*?)$/);
  
  // 抽出したセクションを構造化
  const nursingPlan = {
    longTermGoals: longTermGoalsMatch ? longTermGoalsMatch[1].trim() : '',
    shortTermGoals: shortTermGoalsMatch ? shortTermGoalsMatch[1].trim() : '',
    observationPlan: observationPlanMatch ? observationPlanMatch[1].trim() : '',
    treatmentPlan: treatmentPlanMatch ? treatmentPlanMatch[1].trim() : '',
    educationPlan: educationPlanMatch ? educationPlanMatch[1].trim() : ''
  };
  
  return nursingPlan;
}

/**
 * 看護計画をHTMLフォーマットに変換する関数
 * 
 * @param {Object} nursingPlan 看護計画データ
 * @return {string} HTML形式の看護計画
 */
function formatNursingPlanToHTML(nursingPlan) {
  let html = '';
  
  // 長期目標
  html += '<div class="mb-4"><h3 class="h5 mb-3">長期目標</h3>';
  html += `<div class="p-3 bg-light rounded">${formatTextWithLineBreaks(nursingPlan.longTermGoals)}</div></div>`;
  
  // 短期目標
  html += '<div class="mb-4"><h3 class="h5 mb-3">短期目標</h3>';
  html += `<div class="p-3 bg-light rounded">${formatTextWithLineBreaks(nursingPlan.shortTermGoals)}</div></div>`;
  
  // O-P（観察計画）
  html += '<div class="mb-4"><h3 class="h5 mb-3">O-P（観察計画）</h3>';
  html += `<div class="p-3 bg-light rounded">${formatTextWithLineBreaks(nursingPlan.observationPlan)}</div></div>`;
  
  // T-P（実施計画）
  html += '<div class="mb-4"><h3 class="h5 mb-3">T-P（実施計画）</h3>';
  html += `<div class="p-3 bg-light rounded">${formatTextWithLineBreaks(nursingPlan.treatmentPlan)}</div></div>`;
  
  // E-P（教育計画）
  html += '<div class="mb-4"><h3 class="h5 mb-3">E-P（教育計画）</h3>';
  html += `<div class="p-3 bg-light rounded">${formatTextWithLineBreaks(nursingPlan.educationPlan)}</div></div>`;
  
  return html;
}

/**
 * テキストを改行を保持してHTMLに変換する関数
 */
function formatTextWithLineBreaks(text) {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
}

/**
 * 看護計画をPDF形式でエクスポートする関数
 * 
 * @param {Object} nursingPlan 看護計画データ
 * @param {Object} patientData 患者データ
 */
function exportNursingPlanToPDF(nursingPlan, patientData) {
  // 実際の実装では、jsPDFなどのライブラリを使用してPDFを生成
  alert('看護計画のPDFエクスポート機能は開発中です。');
}

/**
 * 看護計画を編集可能なフォーマットに変換する関数
 * 
 * @param {Object} nursingPlan 看護計画データ
 * @return {string} 編集可能なHTML
 */
function convertNursingPlanToEditable(nursingPlan) {
  let html = '';
  
  // 長期目標
  html += '<div class="mb-4"><h3 class="h5 mb-3">長期目標</h3>';
  html += `<textarea class="form-control" id="editLongTermGoals" rows="4">${nursingPlan.longTermGoals}</textarea></div>`;
  
  // 短期目標
  html += '<div class="mb-4"><h3 class="h5 mb-3">短期目標</h3>';
  html += `<textarea class="form-control" id="editShortTermGoals" rows="4">${nursingPlan.shortTermGoals}</textarea></div>`;
  
  // O-P（観察計画）
  html += '<div class="mb-4"><h3 class="h5 mb-3">O-P（観察計画）</h3>';
  html += `<textarea class="form-control" id="editObservationPlan" rows="6">${nursingPlan.observationPlan}</textarea></div>`;
  
  // T-P（実施計画）
  html += '<div class="mb-4"><h3 class="h5 mb-3">T-P（実施計画）</h3>';
  html += `<textarea class="form-control" id="editTreatmentPlan" rows="6">${nursingPlan.treatmentPlan}</textarea></div>`;
  
  // E-P（教育計画）
  html += '<div class="mb-4"><h3 class="h5 mb-3">E-P（教育計画）</h3>';
  html += `<textarea class="form-control" id="editEducationPlan" rows="6">${nursingPlan.educationPlan}</textarea></div>`;
  
  // 保存ボタン
  html += '<div class="text-center mt-4">';
  html += '<button class="btn btn-primary" id="saveEditedPlan">保存</button> ';
  html += '<button class="btn btn-secondary" id="cancelEditPlan">キャンセル</button>';
  html += '</div>';
  
  return html;
}

/**
 * 編集された看護計画を取得する関数
 * 
 * @return {Object} 編集された看護計画データ
 */
function getEditedNursingPlan() {
  const editedPlan = {
    longTermGoals: document.getElementById('editLongTermGoals').value,
    shortTermGoals: document.getElementById('editShortTermGoals').value,
    observationPlan: document.getElementById('editObservationPlan').value,
    treatmentPlan: document.getElementById('editTreatmentPlan').value,
    educationPlan: document.getElementById('editEducationPlan').value
  };
  
  return editedPlan;
}

// モジュールとしてエクスポート（実際の実装では必要に応じて調整）
const NursingPlanModule = {
  generateNursingPlan,
  createNursingPlanPrompt,
  callChatGPTAPI,
  parseNursingPlanResponse,
  formatNursingPlanToHTML,
  exportNursingPlanToPDF,
  convertNursingPlanToEditable,
  getEditedNursingPlan
};

// グローバルオブジェクトに追加
window.NursingPlanModule = NursingPlanModule;
