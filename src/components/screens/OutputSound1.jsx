import { useState } from 'react'
import './OutputSound1.css'
import ScreenHeader from '../ScreenHeader'

export default function OutputSound1({ navigateTo, goBack, goHome }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayClick = () => {
    // ボタンを押すたびにオレンジ⇔白をトグル
    setIsPlaying((prev) => !prev)
  }

  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        <ScreenHeader title="音声出力" onBack={goBack} onHome={goHome} />

        <div className={`screen-content ${isPlaying ? 'playing' : ''}`}>
          <div className="output-sound-container">
            <div className="sound-visualization">
              <div className="sound-bar"></div>
              <div className="sound-bar"></div>
              <div className="sound-bar"></div>
              <div className="sound-bar"></div>
              <div className="sound-bar"></div>
            </div>

            <h2 className="output-sound-title">音声出力</h2>

            <p className="output-sound-description">
              システムから音声が出力されます。下のボタンを押して再生してください。
            </p>
          </div>

          <div className="play-button-container">
            <button className="play-button" onClick={handlePlayClick}>
              <img src={isPlaying ? '/material/icon_play_white.png' : '/material/icon_play_black.png'} alt="Play" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
