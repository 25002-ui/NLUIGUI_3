// src/components/screens/InputText1.jsx

import React from 'react';
import ScreenHeader from '../ScreenHeader'; // 追加
import './InputText1.css';

const InputText1 = ({ image, inputText, setInputText, handleSend, goBack, goHome }) => {
  return (
    <div className="screen-container">
      <ScreenHeader title="文章を入力" onBack={goBack} onHome={goHome} />
      
      <div className="screen-content">
        <div className="image-section">
          <img src={image} alt="指示画像" className="prompt-image" />
        </div>

        {/* 修正点：画像のすぐ下に入力セクションを配置 */}
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

        <p className="instruction-text">以下の文章をテキスト入力してください。</p>
      </div>
    </div>
  );
};

export default InputText1;
