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

const SCREEN_TITLES = {
  practice_text_1: '練習　テキスト入力',
  practice_text_2: '練習　テキスト入力',
  input_text_1: 'テキスト入力',
  input_text_2: 'テキスト入力',
  practice_sound_1: '練習　音声入力',
  input_sound_1: '音声入力',
  output_text_1: 'テキスト出力',
  soundcheck: '音声チェック',
  output_sound_1: '音声出力',
}

function App() {
  const [isExperimentStarted, setIsExperimentStarted] = useState(false)
  const [subjectName, setSubjectName] = useState('')
  const [isTestMode, setIsTestMode] = useState(false)
  const [currentScreen, setCurrentScreen] = useState('home')
  const [screenHistory, setScreenHistory] = useState([])
  const [practiceTextValue, setPracticeTextValue] = useState('')
  const [inputTextValue, setInputTextValue] = useState('')
  const [isPracticeMicActive, setIsPracticeMicActive] = useState(false)
  const [isInputMicActive, setIsInputMicActive] = useState(false)
  const [isOutputTextChecked, setIsOutputTextChecked] = useState(false)
  const [isOutputSoundPlaying, setIsOutputSoundPlaying] = useState(false)

  const soundcheckAudioRef = useRef(null)
  const outputSoundAudioRef = useRef(null)

  // キーボード高さを管理するロジック
  useEffect(() => {
    const updateViewport = () => {
      if (!window.visualViewport) return
      const vv = window.visualViewport
      // キーボードの高さを計算
      const keyboardHeight = window.innerHeight - vv.height
      document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`)
      document.documentElement.style.setProperty('--vv-offset-top', `${vv.offsetTop}px`)
      
      // 画面の押し上げを防止するため、スクロール位置を強制的にリセット
      if (keyboardHeight > 0) {
        window.scrollTo(0, 0)
      }
    }

    window.visualViewport?.addEventListener('resize', updateViewport)
    window.visualViewport?.addEventListener('scroll', updateViewport)
    updateViewport()

    return () => {
      window.visualViewport?.removeEventListener('resize', updateViewport)
      window.visualViewport?.removeEventListener('scroll', updateViewport)
    }
  }, [])

  const recordLog = (actionName, screenName = currentScreen, buttonName = '', inputText = '') => {
    if (isTestMode) return
    addLog({ subjectName, screenName, actionName, buttonName, inputText })
  }

  const navigateTo = (screenName) => {
    recordLog('画面遷移', screenName, screenName, '')
    setScreenHistory((prev) => [...prev, currentScreen])
    setCurrentScreen(screenName)
  }

  const goBack = () => {
    recordLog('戻るボタン押下')
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1]
      setScreenHistory((h) => h.slice(0, -1))
      setCurrentScreen(prev)
    }
  }

  const goHome = () => {
    recordLog('Homeボタン押下')
    setCurrentScreen('home')
    setScreenHistory([])
  }

  const handleTextSend = (type) => {
    const val = type === 'practice' ? practiceTextValue : inputTextValue
    recordLog('送信ボタン押下', type === 'practice' ? 'practice_text_2' : 'input_text_2', '送信', val)
    type === 'practice' ? setPracticeTextValue('') : setInputTextValue('')
    goBack()
  }

  // --- スクリーン描画コンポーネント ---
  const renderHeader = (title) => (
    <header className="screen-header">
      <button className="header-icon-button" onClick={goBack}><img src={iconBack} alt="戻る" /></button>
      <h1 className="screen-title">{title}</h1>
      <button className="header-icon-button" onClick={goHome}><img src={iconHome} alt="ホーム" /></button>
    </header>
  )

  if (!isExperimentStarted) {
    return (
      <SubjectNameInput 
        onStartExperiment={(name) => { setSubjectName(name); setIsExperimentStarted(true); }}
        onStartTestMode={() => { setIsTestMode(true); setIsExperimentStarted(true); }}
      />
    )
  }

  if (currentScreen === 'home') {
    return (
      <div className="screen-shell home-screen">
        <h1 className="home-title">Home</h1>
        <div className="home-grid">
          <button className="home-card peach" onClick={() => navigateTo('practice_text_1')}>練習 テキスト入力</button>
          <button className="home-card peach" onClick={() => navigateTo('practice_sound_1')}>練習 音声入力</button>
          <button className="home-card peach" onClick={() => navigateTo('input_text_1')}>テキスト入力</button>
          <button className="home-card peach" onClick={() => navigateTo('input_sound_1')}>音声入力</button>
          <button className="home-card blue offset" onClick={() => navigateTo('soundcheck')}>音声チェック</button>
          <button className="home-card blue" onClick={() => navigateTo('output_text_1')}>テキスト出力</button>
          <button className="home-card blue" onClick={() => navigateTo('output_sound_1')}>音声出力</button>
        </div>
      </div>
    )
  }

  // テキスト入力画面の共通レイアウト
  const isTextInput = ['practice_text_1', 'practice_text_2', 'input_text_1', 'input_text_2'].includes(currentScreen)
  if (isTextInput) {
    const isStep2 = currentScreen.endsWith('_2')
    const img = currentScreen.startsWith('practice') ? practiceTextImage : inputTextImage
    
    return (
      <div className="screen-shell text-input-screen">
        {renderHeader(SCREEN_TITLES[currentScreen])}
        <main className="screen-main">
          <p className="screen-description">以下の文章をテキスト入力してください。</p>
          <div className="prompt-image-wrap">
            <img src={img} alt="入力対象文章" className="prompt-image" />
          </div>
        </main>
        
        <div className={`input-area-container ${isStep2 ? 'active' : ''}`}>
          {!isStep2 ? (
            <button className="bottom-input-box" onClick={() => navigateTo(currentScreen.replace('_1', '_2'))}>
              文章を入力
            </button>
          ) : (
            <div className="bottom-input-row">
              <input
                className="bottom-input-field"
                type="text"
                placeholder="文章を入力"
                value={currentScreen.startsWith('practice') ? practiceTextValue : inputTextValue}
                onChange={(e) => currentScreen.startsWith('practice') ? setPracticeTextValue(e.target.value) : setInputTextValue(e.target.value)}
                autoFocus
              />
              <button className="send-button" onClick={() => handleTextSend(currentScreen.startsWith('practice') ? 'practice' : 'input')}>
                <img src={iconSend} alt="送信" />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="screen-shell">
      {renderHeader(SCREEN_TITLES[currentScreen])}
      <main className="screen-main">
         {/* 他の画面の簡易実装。必要に応じて元のコードを戻してください */}
         <p>この画面の実装は継続中...</p>
      </main>
    </div>
  )
}

export default App
