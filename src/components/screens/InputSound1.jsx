import { useState } from 'react'
import './InputSound1.css'
import ScreenHeader from '../ScreenHeader'

export default function InputSound1({ navigateTo, goBack, goHome }) {
  const [isRecording, setIsRecording] = useState(false)

  const handleMicClick = () => {
    setIsRecording(!isRecording)
  }

  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        <ScreenHeader title="音声入力" onBack={goBack} onHome={goHome} />

        <div className={`screen-content ${isRecording ? 'recording' : ''}`}>
          <img src="/material/input_text.png" alt="Input Sound" className="content-image" />

          <div className="description">
            以下の文章を音声入力してください。
          </div>

          <div className="example-text">
            じゃがいもと鶏肉を使った、20分以内で作れて、あっさり系の料理を教えて。ご飯に合う味で、野菜も一緒に取れる料理でお願い。
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
