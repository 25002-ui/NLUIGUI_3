import React, { useState } from 'react';
import './InputText1.css';

const InputText1 = ({ image, onSend }) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (onSend) {
      onSend(inputText);
      setInputText(''); // 送信後にクリア
    }
  };

  return (
    <div className="input-text-container">
      <p className="instruction-text">以下の文章をテキスト入力してください。</p>
      
      <div className="image-section">
        <img src={image} alt="指示画像" className="prompt-image" />
      </div>

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
    </div>
  );
};

export default InputText1;
