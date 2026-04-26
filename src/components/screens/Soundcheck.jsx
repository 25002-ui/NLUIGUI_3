import { useState, useEffect } from 'react'
import './Soundcheck.css'
import ScreenHeader from '../ScreenHeader'

export default function Soundcheck({ navigateTo, goBack, goHome }) {
  useEffect(() => {
    // 画面が開かれた時、soundcheck.mp3をループ再生
    // 実装はまだ行わない（見た目だけ）
  }, [])

  const handlePlayClick = () => {
    // 再生ボタンのクリック処理
    // 実装はまだ行わない（見た目だけ）
  }

  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        <ScreenHeader title="音声チェック" onBack={goBack} onHome={goHome} />

        <div className="screen-content">
          <div className="soundcheck-container">
            <div className="soundcheck-circle">
              <div className="soundcheck-inner">
                <div className="soundcheck-wave"></div>
              </div>
            </div>

            <h2 className="soundcheck-title">システムの音声をチェック</h2>

            <p className="soundcheck-description">
              下の再生ボタンを押してシステムの音声を確認してください。
            </p>
          </div>

          <div className="play-button-container">
            <button className="play-button" onClick={handlePlayClick}>
              <img src="/material/icon_play_white.png" alt="Play" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
