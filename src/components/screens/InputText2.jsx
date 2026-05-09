// 修正箇所：.screen-content 内部の順序変更
<div className="screen-content">
  {/* 1. 画像 */}
  <img src="/material/practice_text.png" alt="Practice Text" className="content-image" />
  
  {/* 2. テキストボックス（ボタンまたは入力欄）を画像直下に固定 */}
  {navigateTo ? (
    <button className="text-input-box" onClick={handleInputClick}>
      <span className="input-placeholder">文章を入力</span>
    </button>
  ) : (
    <div className="input-container">
      <input
        type="text"
        className="text-input-field"
        placeholder="文章を入力"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        autoFocus
      />
      <button className="send-btn" onClick={handleSend}>
        <img src="/material/icon_send.png" alt="Send" />
      </button>
    </div>
  )}

  {/* 3. 説明文や例文は下に移動 */}
  <div className="description">
    以下の文章をテキスト入力してください。
  </div>
  <div className="example-text">
    {/* 例文コンテンツ */}
  </div>
</div>
