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
        {/* 他の画面と統一したヘッダー */}
        <ScreenHeader title="テキスト入力" onBack={goBack} onHome={goHome} />

        <div className="screen-content">
          <img src={image || "/material/input_text.png"} alt="Input Text" className="content-image" />

          {/* 画像のすぐ下にボタンを配置（PracticeText1と共通のクラス名を使用） */}
          <button className="text-input-box" onClick={handleSend}>
            <span className="input-placeholder">文章を入力</span>
          </button>

          <div className="description">
            以下の文章をテキスト入力してください。
          </div>
        </div>
      </div>
    </div>
  )
}
