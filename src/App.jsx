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
  {
    key: 'soundcheck',
    label: ['音声チェック'],
    tone: 'blue',
    spacerBefore: true,
    singleLine: true,
  },
  { key: 'output_text_1', label: ['テキスト出力'], tone: 'blue', singleLine: true },
  { key: 'output_sound_1', label: ['音声出力'], tone: 'blue', singleLine: true },
]

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

function Header({ title, onBack, onHome }) {
  return (
    <header className="screen-header">
      <button className="header-icon-button" type="button" onClick={onBack} aria-label="戻る">
        <img src={iconBack} alt="" />
      </button>
      <h1 className="screen-title">{title}</h1>
      <button className="header-icon-button" type="button" onClick={onHome} aria-label="ホーム">
        <img src={iconHome} alt="" />
      </button>
    </header>
  )
}

function ScreenLayout({ title, onBack, onHome, children, className = '' }) {
  return (
    <div className={`screen-shell ${className}`.trim()}>
      <Header title={title} onBack={onBack} onHome={onHome} />
      <main className="screen-main">{children}</main>
    </div>
  )
}

function HomeScreen({ onNavigate }) {
  return (
    <div className="screen-shell home-screen">
      <h1 className="home-title">Home</h1>
      <div className="home-grid">
        {HOME_BUTTONS.map((button) => (
          <button
            key={button.key}
            className={`home-card home-card-${button.tone} ${button.spacerBefore ? 'home-card-offset' : ''}`}
            type="button"
            onClick={() => onNavigate(button.key)}
          >
            <span className={`home-card-label ${button.singleLine ? 'home-card-label-single' : ''}`.trim()}>
              {button.label.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function PromptImage({ src, alt }) {
  return (
    <div className="prompt-image-wrap">
      <img className="prompt-image" src={src} alt={alt} />
    </div>
  )
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

  const recordLog = (actionName, screenName = currentScreen, buttonName = '', inputText = '') => {
    if (isTestMode) return
    addLog({ subjectName, screenName, actionName, buttonName, inputText })
  }

  const handleStartExperiment = (name) => {
    setSubjectName(name)
    setIsTestMode(false)
    setIsExperimentStarted(true)
    addLog({
      subjectName: name,
      screenName: 'SubjectNameInput',
      actionName: '実験開始',
      buttonName: '開始',
      inputText: '',
    })
  }

  const handleStartTestMode = () => {
    setIsTestMode(true)
    setIsExperimentStarted(true)
    setCurrentScreen('home')
  }

  const navigateTo = (screenName) => {
    if (screenName === 'practice_sound_1') setIsPracticeMicActive(false)
    recordLog('画面遷移', screenName, screenName, '')
    setScreenHistory((history) => [...history, currentScreen])
    setCurrentScreen(screenName)
  }

  const goBack = () => {
    recordLog('戻るボタン押下')
    setScreenHistory((history) => {
      if (history.length === 0) return history
      const nextHistory = history.slice(0, -1)
      setCurrentScreen(history[history.length - 1])
      return nextHistory
    })
  }

  const goHome = () => {
    recordLog('Homeボタン押下')
    setCurrentScreen('home')
    setScreenHistory([])
  }

  useEffect(() => {
    const updateOffset = () => {
      if (!window.visualViewport) return
      // ビューポートの高さとオフセットから、キーボードによる隠れを計算
      const offset = window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop
      document.documentElement.style.setProperty('--keyboard-inset', `${Math.max(0, offset)}px`)
    }

    window.visualViewport?.addEventListener('resize', updateOffset)
    window.visualViewport?.addEventListener('scroll', updateOffset)
    updateOffset()

    return () => {
      window.visualViewport?.removeEventListener('resize', updateOffset)
      window.visualViewport?.removeEventListener('scroll', updateOffset)
    }
  }, [])

  const handlePracticeTextSend = () => {
    recordLog('送信ボタン押下', 'practice_text_2', '送信', practiceTextValue)
    setPracticeTextValue('')
    goBack()
  }

  const handleInputTextSend = () => {
    recordLog('送信ボタン押下', 'input_text_2', '送信', inputTextValue)
    setInputTextValue('')
    goBack()
  }

  const renderScreen = () => {
    if (!isExperimentStarted) {
      return <SubjectNameInput onStartExperiment={handleStartExperiment} onStartTestMode={handleStartTestMode} />
    }

    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigateTo} />

      case 'practice_text_1':
      case 'input_text_1':
        const isPractice1 = currentScreen === 'practice_text_1'
        return (
          <ScreenLayout title={SCREEN_TITLES[currentScreen]} onBack={goBack} onHome={goHome} className="text-input-screen">
            <section className="prompt-stack">
              <p className="screen-description">以下の文章をテキスト入力してください。</p>
              <PromptImage src={isPractice1 ? practiceTextImage : inputTextImage} alt="説明画像" />
            </section>
            <div className="screen-footer">
              <button className="bottom-input-box" type="button" onClick={() => navigateTo(isPractice1 ? 'practice_text_2' : 'input_text_2')}>
                <span>文章を入力</span>
              </button>
            </div>
          </ScreenLayout>
        )

      case 'practice_text_2':
      case 'input_text_2':
        const isPractice2 = currentScreen === 'practice_text_2'
        return (
          <ScreenLayout title={SCREEN_TITLES[currentScreen]} onBack={goBack} onHome={goHome} className="text-input-screen active-input">
            <section className="prompt-stack">
              <p className="screen-description">以下の文章をテキスト入力してください。</p>
              <PromptImage src={isPractice2 ? practiceTextImage : inputTextImage} alt="説明画像" />
            </section>
            <div className="screen-footer">
              <div className="bottom-input-row">
                <input
                  className="bottom-input-field"
                  type="text"
                  placeholder="文章を入力"
                  value={isPractice2 ? practiceTextValue : inputTextValue}
                  onChange={(e) => isPractice2 ? setPracticeTextValue(e.target.value) : setInputTextValue(e.target.value)}
                  autoFocus
                />
                <button className="send-button" type="button" onClick={isPractice2 ? handlePracticeTextSend : handleInputTextSend}>
                  <img src={iconSend} alt="送信" />
                </button>
              </div>
            </div>
          </ScreenLayout>
        )
      
      /* ... 他の音声画面などは以前のロジックと同様 ... */
      default:
        return <HomeScreen onNavigate={navigateTo} />
    }
  }

  return <div className="app-shell">{renderScreen()}</div>
}

export default App
