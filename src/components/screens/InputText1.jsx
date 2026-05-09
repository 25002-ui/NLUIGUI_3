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
    <div className="screen-content">
  {/* 新しく「画像とボタンだけのグループ」を作る */}
  <div className="image-button-unit">
    <img src={image || "/material/input_text.png"} alt="Input Text" className="content-image" />
    <button className="text-input-box" onClick={handleSend}>
      <span className="input-placeholder">文章を入力</span>
    </button>
  </div>

  {/* 説明文はユニットの外に出す */}
  <div className="description">
    以下の文章をテキスト入力してください。
      </div>
      </div>  
      </div>
    </div>
  )
}
