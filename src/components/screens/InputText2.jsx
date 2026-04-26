import { useState } from 'react'
import './InputText2.css'
import ScreenHeader from '../ScreenHeader'

export default function InputText2({ navigateTo, goBack, goHome }) {
  const [inputText, setInputText] = useState('')

  const handleSend = () => {
    goBack()
  }

  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        <ScreenHeader title="テキスト入力" onBack={goBack} onHome={goHome} />

        <div className="screen-content">
          <img src="/material/input_text.png" alt="Input Text" className="content-image" />

          <div className="description">
            以下の文章をテキスト入力してください。
          </div>

          <div className="example-text">
            じゃがいもと鶏肉を使った、20分以内で作れて、あっさり系の料理を教えて。ご飯に合う味で、野菜も一緒に取れる料理でお願い。
          </div>

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
        </div>
      </div>
    </div>
  )
}
