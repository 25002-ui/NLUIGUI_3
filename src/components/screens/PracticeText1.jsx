import { useState } from 'react'
import './PracticeText1.css'
import ScreenHeader from '../ScreenHeader'

export default function PracticeText1({ navigateTo, goBack, goHome }) {
  const handleInputClick = () => {
    navigateTo('practice_text_2')
  }

  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        {/* ScreenHeaderを導入 */}
        <ScreenHeader title="練習 テキスト入力" onBack={goBack} onHome={goHome} />

        <div className="screen-content">
          <img src="/material/practice_text.png" alt="Practice Text" className="content-image" />

          {/* 画像のすぐ下にボタンを配置 */}
          <button className="text-input-box" onClick={handleInputClick}>
            <span className="input-placeholder">文章を入力</span>
          </button>

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
