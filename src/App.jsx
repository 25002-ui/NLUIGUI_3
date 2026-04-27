import { useEffect, useRef, useState } from 'react'
import './App.css'
import SubjectNameInput from './components/SubjectNameInput'
import iconBack from '../material/icon_back.png'
import iconHome from '../material/icon_home.png'
import iconSend from '../material/icon_send.png'
import iconMute from '../material/icon_mute.png'
import iconMic from '../material/icon_mic.png'
import iconCheckBlack from '../material/icon_check_black.png'
import iconCheckWhite from '../material/icon_check_white.png'
import iconPlayBlack from '../material/icon_play_black.png'
import iconPlayWhite from '../material/icon_play_white.png'
import practiceTextImage from '../material/practice_text.png'
import inputTextImage from '../material/input_text.png'
import outputTextImage from '../material/output_text.png'
import soundcheckAudioFile from '../material/soundcheck.mp3'
import outputSoundAudioFile from '../material/output_sound.mp3'
import { addLog } from './utils/logger'

const HOME_BUTTONS = [
  { key: 'practice_text_1', label: ['練習', 'テキスト入力'], tone: 'peach' },
  { key: 'practice_sound_1', label: ['練習', '音声入力'], tone: 'peach' },
  { key: 'input_text_1', label: ['テキスト入力'], tone: 'peach', singleLine: true },
  { key: 'input_sound_1', label: ['音声入力'], tone: 'peach', singleLine: true },
  { key: 'soundcheck', label: ['音声チェック'], tone: 'blue', spacerBefore: true, singleLine: true },
  { key: 'output_text_1', label: ['テキスト出力'], tone: 'blue', singleLine: true },
  { key: 'output_sound_1', label: ['音声出力'], tone: 'blue', singleLine: true },
]

const SCREEN_TITLES = {
  practice_text_1: '練習　テキスト入力', practice_text_2: '練習　テキスト入力',
  input_text_1: 'テキスト入力', input_text_2: 'テキスト入力',
  practice_sound_1: '練習　音声入力', input_sound_1: '音声入力',
  output_text_1: 'テキスト出力', soundcheck: '音声チェック', output_sound_1: '音声出力',
}

function App() {
  const [isExperimentStarted, setIsExperimentStarted] = useState(false)
  const [subjectName, setSubjectName] = useState('')
  const [isTestMode, setIsTestMode] = useState(false)
  const [currentScreen, setCurrentScreen] = useState('home')
  const [screenHistory, setScreenHistory] = useState([])
  const [inputText, setInputText] = useState('')
  const [isPracticeMicActive, setIsPracticeMicActive] = useState(false)
  const [isInputMicActive, setIsInputMicActive] = useState(false)
  const [isOutputTextChecked, setIsOutputTextChecked] = useState(false)
  const [isOutputSoundPlaying, setIsOutputSoundPlaying] = useState(false)

  // キーボード高さを監視してスクロール位置を調整
  useEffect(() => {
    const handleViewportChange = () => {
      if (!window.visualViewport) return
      const vv = window.visualViewport
      const offset = window.innerHeight - vv.height - vv.offsetTop
      document.documentElement.style.setProperty('--keyboard-inset', `${Math.max(0, offset)}px`)
      
      // キーボード表示時に入力欄が隠れないように、少しスクロールさせる
      if (offset > 0) {
        window.scrollTo(0, offset)
      }
    }
    window.visualViewport?.addEventListener('resize', handleViewportChange)
    window.visualViewport?.addEventListener('scroll', handleViewportChange)
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange)
      window.visualViewport?.removeEventListener('scroll', handleViewportChange)
    }
  }, [])

  const recordLog = (actionName, screenName = currentScreen, buttonName = '', val = '') => {
    if (isTestMode) return
    addLog({ subjectName, screenName, actionName, buttonName, inputText: val })
  }

  const navigateTo = (screenName) => {
    recordLog('画面遷移', screenName, screenName, '')
    setScreenHistory((prev) => [...prev, currentScreen])
    setCurrentScreen(screenName)
    setInputText('')
  }

  const goBack = () => {
    recordLog('戻るボタン押下')
    if (screenHistory.length === 0) return
    const prev = screenHistory[screenHistory.length - 1]
    setScreenHistory((h) => h.slice(0, -1))
    setCurrentScreen(prev)
  }

  const goHome = () => {
    recordLog('Homeボタン押下')
    setCurrentScreen('home')
    setScreenHistory([])
  }

  if (!isExperimentStarted) {
    return <SubjectNameInput onStartExperiment={(n) => { setSubjectName(n); setIsExperimentStarted(true); }} onStartTestMode={() => { setIsTestMode(true); setIsExperimentStarted(true); }} />
  }

  if (currentScreen === 'home') {
    return (
      <div className="screen-shell home-screen">
        <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>Home</h1>
        <div className="home-grid">
          {HOME_BUTTONS.map((b) => (
            <button key={b.key} className={`home-card home-card-${b.tone} ${b.spacerBefore ? 'home-card-offset' : ''}`} onClick={() => navigateTo(b.key)}>
              <span className="home-card-label">{b.label.map(l => <span key={l}>{l}</span>)}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const isStep2 = currentScreen.endsWith('_2')
  const isPractice = currentScreen.startsWith('practice')
  const title = SCREEN_TITLES[currentScreen]
  const imageSrc = isPractice ? practiceTextImage : inputTextImage

  return (
    <div className="screen-shell">
      <header className="screen-header">
        <button className="header-icon-button" onClick={goBack}><img src={iconBack} alt="戻る" /></button>
        <h1 className="screen-title">{title}</h1>
        <button className="header-icon-button" onClick={goHome}><img src={iconHome} alt="ホーム" /></button>
      </header>

      <main className="screen-main">
        <div className="prompt-stack">
          <p className="screen-description">以下の文章をテキスト入力してください。</p>
          <div className="prompt-image-wrap"><img className="prompt-image" src={imageSrc} alt="" /></div>
          
          {/* 入力欄を画像の下に配置 */}
          <div className="input-container-wrapper">
            {!isStep2 ? (
              <button className="bottom-input-box" onClick={() => navigateTo(currentScreen.replace('_1', '_2'))}>
                <span>文章を入力</span>
              </button>
            ) : (
              <div className="bottom-input-row">
                <input 
                  className="bottom-input-field" 
                  type="text" 
                  placeholder="文章を入力" 
                  autoFocus 
                  value={inputText} 
                  onChange={(e) => setInputText(e.target.value)} 
                />
                <button className="send-button" onClick={() => { recordLog('送信', currentScreen, '送信', inputText); goHome(); }}>
                  <img src={iconSend} alt="送信" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
