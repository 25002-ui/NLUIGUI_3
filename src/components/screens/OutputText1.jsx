import { useState } from 'react'
import './OutputText1.css'
import ScreenHeader from '../ScreenHeader'

export default function OutputText1({ navigateTo, goBack, goHome }) {
  // isCheckedがtrueの時に「画像表示」かつ「背景色変更」を行う
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckClick = () => {
    setIsChecked(!isChecked)
  }

  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        <ScreenHeader title="テキスト出力" onBack={goBack} onHome={goHome} />

        {/* isCheckedの状態に応じて 'checked' クラスを付与 */}
        <div className={`screen-content ${isChecked ? 'checked' : ''}`}>
          
          {/* 【変更点】isCheckedがtrueの時のみ画像を表示 */}
          {isChecked && (
            <img 
              src="/material/output_text.png" 
              alt="Output Text" 
              className="content-image fade-in" 
            />
          )}

          <div className="output-text">
            玉ねぎと中華麺を使った、ピリ辛料理について教えてください。
          </div>

          <div className="check-button-container">
            <button className="check-button" onClick={handleCheckClick}>
              <img 
                src={isChecked ? '/material/icon_check_white.png' : '/material/icon_check_black.png'} 
                alt="Check" 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
