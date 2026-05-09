import { useState } from 'react'
import './InputText1.css'
import ScreenHeader from '../ScreenHeader'

export default function InputText1({ image, onSend, goBack, goHome }) {
  const [inputText, setInputText] = useState('')

  const handleSend = () => {
    if (onSend && inputText.trim() !== '') {
      onSend(inputText)
      setInputText('')
    }
  }

  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        <ScreenHeader title="テキスト入力" onBack={goBack} onHome={goHome} />

        <div className="screen-content">
          {/* 画像と入力エリアを密着させたグループ */}
          <div className="input-group-unit">
            <img 
              src={image || "/material/input_text.png"} 
              alt="Instruction" 
              className="content-image" 
            />
            
            <div className="input-field-row">
              {/* 本物の入力フォームに変更 */}
              <input 
                type="text"
                className="real-text-input"
                placeholder="文章を入力"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              
              {/* 送信ボタン (material/icon_send.png) */}
              <button className="send-action-button" onClick={handleSend}>
                <img src="/material/icon_send.png" alt="送信" />
              </button>
            </div>
          </div>

          <div className="description">
            以下の文章をテキスト入力してください。
          </div>
        </div>
      </div>
    </div>
  )
}
