import { useState } from 'react'
import './PracticeText2.css'
import ScreenHeader from '../ScreenHeader'

export default function PracticeText2({ navigateTo, goBack, goHome }) {
  const [inputText, setInputText] = useState('')

  const handleSend = () => {
    goBack()
  }

  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        <ScreenHeader title="練習 テキスト入力" onBack={goBack} onHome={goHome} />

        <div className="screen-content">
          <img src="/material/practice_text.png" alt="Practice Text" className="content-image" />

          {/* 修正：画像のすぐ下に入力欄を配置 */}
          <div className="input-container">
            <input
              type="text"
              className="text-input-field"
              placeholder="文章を入力"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              autoFocus
            />
            <button className="send-btn" onClick={handleSend}>
              <img src="/material/icon_send.png" alt="Send" />
            </button>
          </div>

          <div className="description">
            以下の文章をテキスト入力してください。
          </div>

          <div className="example-text">
            玉ねぎと中華麺を使った、ピリ辛料理を教えて。洗い物が少なくて、ネギは使わず、15分以内で作れる料理でできれば簡単にお願い。
          </div>
        </div>
      </div>
    </div>
  )
}
