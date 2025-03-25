/**
 * 看護記録AIアプリケーション - 関連図生成スクリプト
 */

// 関連図生成のためのサンプルデータ構造
const sampleRelationshipData = {
  // 現病名を中心とした関連図
  disease: {
    name: "2型糖尿病",
    symptoms: [
      {
        name: "高血糖",
        problems: ["末梢神経障害", "網膜症リスク"]
      },
      {
        name: "口渇",
        problems: ["脱水リスク"]
      },
      {
        name: "多尿",
        problems: ["電解質バランス異常", "脱水リスク"]
      }
    ]
  },
  
  // 看護問題のリスト
  nursingProblems: [
    "セルフケア不足",
    "栄養バランス異常",
    "活動耐性低下",
    "感染リスク増大"
  ],
  
  // 患者の強み
  strengths: [
    "家族のサポート",
    "治療への意欲",
    "自己管理能力"
  ]
};

/**
 * アセスメントデータから関連図のMermaidコードを生成する関数
 * 
 * @param {Object} assessmentData アセスメントデータ
 * @return {string} Mermaidコード
 */
function generateRelationshipDiagram(assessmentData) {
  // 実際の実装では、アセスメントデータをパースして関連図を生成
  // ここではサンプルデータを使用
  
  let mermaidCode = "graph TD\n";
  
  // 現病名をルートノードとして追加
  mermaidCode += `  A["${sampleRelationshipData.disease.name}"]\n`;
  
  // 症状を追加
  sampleRelationshipData.disease.symptoms.forEach((symptom, sIndex) => {
    const symptomId = `B${sIndex + 1}`;
    mermaidCode += `  ${symptomId}["${symptom.name}"]\n`;
    mermaidCode += `  A --> ${symptomId}\n`;
    
    // 問題点を追加
    symptom.problems.forEach((problem, pIndex) => {
      const problemId = `C${sIndex + 1}${pIndex + 1}`;
      mermaidCode += `  ${problemId}["${problem}"]\n`;
      mermaidCode += `  ${symptomId} --> ${problemId}\n`;
    });
  });
  
  // 看護問題を追加
  mermaidCode += "  D[\"看護問題\"]\n";
  sampleRelationshipData.nursingProblems.forEach((problem, index) => {
    const problemId = `E${index + 1}`;
    mermaidCode += `  ${problemId}["${problem}"]\n`;
    mermaidCode += `  D --> ${problemId}\n`;
  });
  
  // 現病名と看護問題を接続
  mermaidCode += "  A --> D\n";
  
  // 患者の強みを追加
  mermaidCode += "  F[\"患者の強み\"]\n";
  sampleRelationshipData.strengths.forEach((strength, index) => {
    const strengthId = `G${index + 1}`;
    mermaidCode += `  ${strengthId}["${strength}"]\n`;
    mermaidCode += `  F --> ${strengthId}\n`;
  });
  
  // スタイル設定
  mermaidCode += "  classDef disease fill:#f96,stroke:#333,stroke-width:2px;\n";
  mermaidCode += "  classDef symptom fill:#9cf,stroke:#333,stroke-width:1px;\n";
  mermaidCode += "  classDef problem fill:#fcf,stroke:#333,stroke-width:1px;\n";
  mermaidCode += "  classDef nursing fill:#cf9,stroke:#333,stroke-width:2px;\n";
  mermaidCode += "  classDef strength fill:#9fc,stroke:#333,stroke-width:1px;\n";
  mermaidCode += "  class A disease;\n";
  
  // 症状ノードにスタイルを適用
  sampleRelationshipData.disease.symptoms.forEach((_, sIndex) => {
    mermaidCode += `  class B${sIndex + 1} symptom;\n`;
  });
  
  // 問題点ノードにスタイルを適用
  sampleRelationshipData.disease.symptoms.forEach((symptom, sIndex) => {
    symptom.problems.forEach((_, pIndex) => {
      mermaidCode += `  class C${sIndex + 1}${pIndex + 1} problem;\n`;
    });
  });
  
  // 看護問題ノードにスタイルを適用
  mermaidCode += "  class D nursing;\n";
  sampleRelationshipData.nursingProblems.forEach((_, index) => {
    mermaidCode += `  class E${index + 1} nursing;\n`;
  });
  
  // 強みノードにスタイルを適用
  mermaidCode += "  class F strength;\n";
  sampleRelationshipData.strengths.forEach((_, index) => {
    mermaidCode += `  class G${index + 1} strength;\n`;
  });
  
  return mermaidCode;
}

/**
 * アセスメントテキストから関連図データを抽出する関数
 * 
 * @param {string} assessmentText アセスメントテキスト
 * @return {Object} 関連図データ
 */
function extractRelationshipDataFromAssessment(assessmentText) {
  // 実際の実装では、自然言語処理やパターンマッチングを使用して
  // アセスメントテキストから関連図データを抽出
  
  // ここではサンプルデータを返す
  return sampleRelationshipData;
}

/**
 * 関連図のMermaidコードをカスタマイズする関数
 * 
 * @param {string} mermaidCode 基本的なMermaidコード
 * @param {Object} options カスタマイズオプション
 * @return {string} カスタマイズされたMermaidコード
 */
function customizeRelationshipDiagram(mermaidCode, options = {}) {
  // デフォルトオプション
  const defaultOptions = {
    direction: 'TD', // TD: トップダウン, LR: 左から右
    theme: 'default', // default, forest, dark, neutral
    showStrengths: true, // 患者の強みを表示するかどうか
    detailLevel: 'full' // full, medium, simple
  };
  
  // オプションをマージ
  const mergedOptions = { ...defaultOptions, ...options };
  
  // 方向を変更
  if (mergedOptions.direction !== 'TD') {
    mermaidCode = mermaidCode.replace('graph TD', `graph ${mergedOptions.direction}`);
  }
  
  // 詳細レベルに応じて内容を調整
  if (mergedOptions.detailLevel !== 'full') {
    // 簡易表示の場合は一部のノードを削除
    const lines = mermaidCode.split('\n');
    const filteredLines = lines.filter(line => {
      // 強みを表示しない場合
      if (!mergedOptions.showStrengths && (line.includes('F[') || line.includes('G'))) {
        return false;
      }
      
      // 中程度の詳細レベルの場合
      if (mergedOptions.detailLevel === 'medium' && line.includes('C')) {
        return false;
      }
      
      // 簡易表示の場合
      if (mergedOptions.detailLevel === 'simple' && (line.includes('B') || line.includes('C'))) {
        return false;
      }
      
      return true;
    });
    
    mermaidCode = filteredLines.join('\n');
  }
  
  return mermaidCode;
}

/**
 * 関連図を画像としてエクスポートする関数
 * 
 * @param {string} svgElement SVG要素
 * @param {string} fileName ファイル名
 */
function exportRelationshipDiagram(svgElement, fileName = 'relationship-diagram') {
  // SVG要素を取得
  const svg = document.querySelector(svgElement);
  if (!svg) {
    console.error('SVG要素が見つかりません');
    return;
  }
  
  // SVGをデータURLに変換
  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);
  
  // ダウンロードリンクを作成
  const downloadLink = document.createElement('a');
  downloadLink.href = svgUrl;
  downloadLink.download = `${fileName}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  // PNG形式でもエクスポート
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const pngUrl = canvas.toDataURL('image/png');
    const downloadPngLink = document.createElement('a');
    downloadPngLink.href = pngUrl;
    downloadPngLink.download = `${fileName}.png`;
    document.body.appendChild(downloadPngLink);
    downloadPngLink.click();
    document.body.removeChild(downloadPngLink);
    
    // リソースを解放
    URL.revokeObjectURL(svgUrl);
  };
  
  img.src = svgUrl;
}

// モジュールとしてエクスポート（実際の実装では必要に応じて調整）
const RelationshipDiagramModule = {
  generateRelationshipDiagram,
  extractRelationshipDataFromAssessment,
  customizeRelationshipDiagram,
  exportRelationshipDiagram
};

// グローバルオブジェクトに追加
window.RelationshipDiagramModule = RelationshipDiagramModule;
