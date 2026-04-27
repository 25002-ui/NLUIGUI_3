import { useState } from 'react'
import './OutputText1.css'
import ScreenHeader from '../ScreenHeader'

export default function OutputText1({ navigateTo, goBack, goHome }) {
  // step 0: 初期状態（「表示」ボタンのみ）
  // step 1: 画像表示（黒チェックボタン）
  // step 2: 背景色変更（白チェックボタン）
  const [step, setStep] = useState(0)

  const handleNextStep = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      // step 2 の状態で押された場合の挙動（必要に応じてリセットなど）
      setStep(0)
    }
  }

  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        <ScreenHeader title="テキスト出力" onBack={goBack} onHome={goHome} />

        {/* step 2 の時に背景色を変更するクラスを付与 */}
        <div className={`screen-content ${step === 2 ? 'checked' : ''}`}>
          
          {/* step 1 以上で画像を表示 */}
          {step >= 1 && (
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
            {step === 0 ? (
              <button className="text-display-button" onClick={handleNextStep}>
                表示
              </button>
            ) : (
              <button className="check-button" onClick={handleNextStep}>
                <img 
                  src={step === 2 ? '/material/icon_check_white.png' : '/material/icon_check_black.png'} 
                  alt="Check" 
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
