import React from 'react';
import ScreenHeader from '../ScreenHeader';
import './InputText1.css';

const InputText1 = ({ image, inputText, setInputText, handleSend, goBack, goHome }) => {
  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        <ScreenHeader title="テキスト入力" onBack={goBack} onHome={goHome} />
        
        <div className="screen-content">
          <img src={image || "/material/input_text.png"} alt="指示画像" className="content-image" />

          {/* 修正：画像のすぐ下に入力セクションを配置 */}
          <div className="input-section">
            <input
              type="text"
              className="capsule-input"
              placeholder="文章を入力"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              className="capsule-button" 
              onClick={handleSend}
              type="button"
            >
              送信
            </button>
          </div>

          <div className="description">
            以下の文章をテキスト入力してください。
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputText1;
