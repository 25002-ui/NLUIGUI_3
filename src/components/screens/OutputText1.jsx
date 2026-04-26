import { useState } from 'react'
import './OutputText1.css'
import ScreenHeader from '../ScreenHeader'

export default function OutputText1({ navigateTo, goBack, goHome }) {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckClick = () => {
    setIsChecked(!isChecked)
  }

  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        <ScreenHeader title="テキスト出力" onBack={goBack} onHome={goHome} />

        <div className={`screen-content ${isChecked ? 'checked' : ''}`}>
          <img src="/material/output_text.png" alt="Output Text" className="content-image" />

          <div className="output-text">
            玉ねぎと中華麺を使った、ピリ辛料理について教えてください。
          </div>

          <div className="check-button-container">
            <button className="check-button" onClick={handleCheckClick}>
              <img src={isChecked ? '/material/icon_check_white.png' : '/material/icon_check_black.png'} alt="Check" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
