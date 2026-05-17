import './Home.css'

export default function Home({ navigateTo }) {
  return (
    <div className="home-container">
      <div className="home-wrapper">
        <h1 className="home-title">Home</h1>
        
        <div className="buttons-grid">
          {/* Row 1: 練習系 */}
          <button className="home-button practice-button" onClick={() => navigateTo('practice_text_1')}>
            <span className="button-text">練習<br />テキスト入力</span>
          </button>
          <button className="home-button practice-button" onClick={() => navigateTo('practice_sound_1')}>
            <span className="button-text">練習<br />音声入力</span>
          </button>

          {/* Row 2: 通常テキスト・音声入力 */}
          <button className="home-button peach-button" onClick={() => navigateTo('input_text_1')}>
            <span className="button-text">テキスト入力</span>
          </button>
          <button className="home-button peach-button" onClick={() => navigateTo('input_sound_1')}>
            <span className="button-text">音声入力</span>
          </button>

          {/* Row 3: 音声チェック（単独配置） */}
          <button className="home-button check-button" onClick={() => navigateTo('soundcheck')}>
            <span className="button-text">音声チェック</span>
          </button>

          {/* Row 4: テキスト・音声出力 */}
          <button className="home-button blue-button" onClick={() => navigateTo('output_text_1')}>
            <span className="button-text">テキスト出力</span>
          </button>
          <button className="home-button blue-button" onClick={() => navigateTo('output_sound_1')}>
            <span className="button-text">音声出力</span>
          </button>
        </div>
      </div>
    </div>
  )
}
