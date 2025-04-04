/**
 * 利用規約モーダルを表示する関数
 */

export function showTermsModal() {
    // モーダルのHTMLを作成
    const modalHtml = `
    <div class="modal fade" id="termsModal" tabindex="-1" aria-labelledby="termsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="termsModalLabel">利用規約</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h6>1. サービスの利用について</h6>
            <p>本サービスは、看護記録の作成支援ツールです。医療・看護の専門知識を持つ方が使用することを前提としています。</p>
            
            <h6>2. 責任の制限</h6>
            <p>本サービスは情報提供を目的としており、実際の医療行為や看護判断の代替となるものではありません。生成された内容の正確性や適切性については、利用者ご自身の責任において判断してください。</p>
            
            <h6>3. 個人情報の取り扱い</h6>
            <p>本サービスに入力された患者情報は、アセスメントや看護計画の生成のためにのみ使用され、当社のサーバーに保存されます。個人を特定できる情報の入力は避けてください。</p>
            
            <h6>4. 知的財産権</h6>
            <p>本サービスに関するすべての知的財産権は当社に帰属します。生成されたコンテンツの著作権は利用者に帰属しますが、サービス改善のために匿名化されたデータを使用することがあります。</p>
            
            <h6>5. 禁止事項</h6>
            <p>本サービスの不正利用、リバースエンジニアリング、第三者へのアカウント共有などの行為は禁止されています。</p>
            
            <h6>6. サービスの変更・中断</h6>
            <p>当社は、予告なくサービスの内容を変更したり、サービスの提供を中断・終了したりすることがあります。</p>
            
            <h6>7. 利用規約の変更</h6>
            <p>当社は、必要に応じて本規約を変更することがあります。変更後の規約は、本サービス上に表示した時点から効力を生じるものとします。</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">閉じる</button>
          </div>
        </div>
      </div>
    </div>
  `;

    // モーダルをDOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // モーダルを表示
    const modal = new bootstrap.Modal(document.getElementById('termsModal'));
    modal.show();

    // モーダルが閉じられたときの処理
    document.getElementById('termsModal').addEventListener('hidden.bs.modal', function () {
        // モーダルをDOMから削除
        this.remove();
    });
}

/**
 * プライバシーポリシーモーダルを表示する関数
 */

export function showPrivacyModal() {
  // モーダルのHTMLを作成
  const privacyModalHtml = `
    <div class="modal fade" id="privacyModal" tabindex="-1" aria-labelledby="privacyModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="privacyModalLabel">プライバシーポリシー</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h6>1. 個人情報の収集について</h6>
            <p>本サービスでは、個人情報に該当する可能性のあるデータを取り扱います。そのため、可能な限り個人を特定できる情報の入力を避けることを推奨しています。</p>
            
            <h6>2. 収集した情報の利用目的</h6>
            <p>収集した情報は、アセスメントの生成、看護計画の作成支援、サービスの改善、ユーザーサポートの提供を目的として利用されます。</p>
            
            <h6>3. 個人情報の管理</h6>
            <p>当社は、ユーザーの個人情報を適切に管理し、不正アクセス、紛失、改ざん、漏洩の防止に努めます。</p>
            
            <h6>4. 第三者への提供について</h6>
            <p>当社は、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。</p>
            
            <h6>5. クッキー（Cookie）について</h6>
            <p>本サービスでは、ユーザー体験の向上のためにクッキーを使用することがあります。クッキーの使用を希望しない場合は、ブラウザの設定を変更してください。</p>
            
            <h6>6. 情報の保存期間</h6>
            <p>ユーザーが入力した情報は、必要な期間のみ保存され、利用目的が達成され次第、適切に削除されます。</p>
            
            <h6>7. プライバシーポリシーの変更</h6>
            <p>当社は、必要に応じて本ポリシーを変更することがあります。変更後のポリシーは、本サービス上に表示した時点から効力を生じるものとします。</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">閉じる</button>
          </div>
        </div>
      </div>
    </div>
  `;


  // モーダルをDOMに追加
  document.body.insertAdjacentHTML('beforeend', privacyModalHtml);

  // モーダルを表示
  const modal = new bootstrap.Modal(document.getElementById('privacyModal'));
  modal.show();

  // モーダルが閉じられたときの処理
  document.getElementById('privacyModal').addEventListener('hidden.bs.modal', function () {
    // モーダルをDOMから削除
    this.remove();
  });
}