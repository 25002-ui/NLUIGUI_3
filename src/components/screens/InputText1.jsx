import { useState } from 'react'
import './InputText1.css'
import ScreenHeader from '../ScreenHeader'

export default function InputText1({ image, onSend, goBack, goHome }) {
  const [inputText, setInputText] = useState('')

  const handleSend = () => {
    if (onSend) {
      onSend(inputText)
      setInputText('')
    }
  }

  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        <ScreenHeader title="テキスト入力" onBack={goBack} onHome={goHome} />

        <div className="screen-content">
          {/* 画像とボタンを一つのユニットに固定 */}
          <div className="image-button-unit">
            <img 
              src={image || "/material/input_text.png"} 
              alt="Input Text" 
              className="content-image" 
            />
            <button className="text-input-box" onClick={handleSend}>
              <span className="input-placeholder">文章を入力</span>
            </button>
          </div>

          <div className="description">
            以下の文章をテキスト入力してください。
          </div>
        </div>
      </div>
    </div>
  )
}
