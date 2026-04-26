import { useState } from 'react'
import './InputText1.css'
import ScreenHeader from '../ScreenHeader'

export default function InputText1({ navigateTo, goBack, goHome }) {
  const [inputText, setInputText] = useState('')

  const handleInputClick = () => {
    navigateTo('input_text_2')
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

          <button className="text-input-box" onClick={handleInputClick}>
            <span className="input-placeholder">文章を入力</span>
          </button>
        </div>
      </div>
    </div>
  )
}
