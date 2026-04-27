import { useState } from 'react'
import './OutputText1.css'
import ScreenHeader from '../ScreenHeader'

export default function OutputText1({ navigateTo, goBack, goHome }) {
  // step 0: output_text_1 (初期：画像なし、表示ボタン)
  // step 1: output_text_2 (画像あり、黒チェックボタン)
  // step 2: output_text_3 (画像あり、オレンジ背景、白チェックボタン)
  const [step, setStep] = useState(0)

  const handleNextStep = () => {
    if (step === 0) {
      setStep(1)
    } else if (step === 1) {
      setStep(2)
    } else {
      setStep(0) // ループさせる場合
    }
  }

  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        <ScreenHeader title="テキスト出力" onBack={goBack} onHome={goHome} />

        {/* step 2 の時だけ 'state-orange' クラスを付与して背景を変える */}
        <div className={`screen-content ${step === 2 ? 'state-orange' : ''}`}>
          
          {/* step 1 か 2 の時だけ画像を表示 */}
          {(step === 1 || step === 2) && (
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
              // step 0: 「表示」テキストボタン
              <button className="text-display-button" onClick={handleNextStep}>
                表示
              </button>
            ) : (
              // step 1, 2: アイコンボタン
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
