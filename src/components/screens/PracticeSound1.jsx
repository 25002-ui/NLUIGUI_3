import { useState } from 'react'
import './PracticeSound1.css'
import ScreenHeader from '../ScreenHeader'

export default function PracticeSound1({ navigateTo, goBack, goHome }) {
  const [isRecording, setIsRecording] = useState(false)

  const handleMicClick = () => {
    setIsRecording(!isRecording)
  }

  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        <ScreenHeader title="練習 音声入力" onBack={goBack} onHome={goHome} />

        <div className="screen-content">
          <img src="/material/practice_text.png" alt="Practice Sound" className="content-image" />

          <div className="description">
            以下の文章を音声入力してください。
          </div>

          <div className="example-text">
            玉ねぎと中華麺を使った、ピリ辛料理を教えて。洗い物が少なくて、ネギは使わず、15分以内で作れる料理でできれば簡単にお願い。
          </div>

          <div className="mic-button-container">
            <button className="mic-button" onClick={handleMicClick}>
              <img src={isRecording ? '/material/icon_mic.png' : '/material/icon_mute.png'} alt="Microphone" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
