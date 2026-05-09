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
          <img src={image || "/material/input_text.png"} alt="Input Text" className="content-image" />

          {/* 修正：画像のすぐ下に入力欄を配置 */}
          <div className="input-container">
            <input
              type="text"
              className="text-input-field"
              placeholder="文章を入力"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button className="send-btn" onClick={handleSend}>
              <img src="/material/icon_send.png" alt="Send" />
            </button>
          </div>

          <div className="description">
            以下の文章をテキスト入力してください。
          </div>

          <div className="example-text">
            じゃがいもと鶏肉を使った、20分以内で作れて、あっさり系の料理を教えて。ご飯に合う味で、野菜も一緒に取れる料理でお願い。
          </div>
        </div>
      </div>
    </div>
  )
}
