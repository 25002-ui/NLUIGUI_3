import { useEffect, useRef, useState } from 'react'
import './App.css'
import SubjectNameInput from './components/SubjectNameInput'
import iconBack from '../material/icon_back.png'
import iconHome from '../material/icon_home.png'
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
  { key: 'practice_text', label: ['練習', 'テキスト入力'], tone: 'peach' },
  { key: 'practice_sound_1', label: ['練習', '音声入力'], tone: 'peach' },
  { key: 'input_text', label: ['テキスト入力'], tone: 'peach', singleLine: true },
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
  practice_text: '練習　テキスト入力',
  input_text: 'テキスト入力',
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

function InputComposer({ value, onChange, onSend }) {
  return (
    <div className="input-composer-container">
      <input
        className="capsule-input-field"
        type="text"
        placeholder="文章を入力"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button className="capsule-send-button" type="button" onClick={onSend}>
        送信
      </button>
    </div>
  )
}

function RoundActionButton({ icon, alt, backgroundColor, onClick }) {
  return (
    <button
      className="round-action-button"
      type="button"
      onClick={onClick}
      style={{ backgroundColor }}
      aria-label={alt}
    >
      <img src={icon} alt="" />
    </button>
  )
}

function App() {
  const [isExperimentStarted, setIsExperimentStarted] = useState(false)
  const [subjectName, setSubjectName] = useState('')
  const [isTestMode, setIsTestMode] = useState(false)
  const [currentScreen, setCurrentScreen] = useState('home')
  const [screenHistory, setScreenHistory] = useState([])
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
    addLog({ subjectName: name, screenName: 'SubjectNameInput', actionName: '実験開始', buttonName: '開始', inputText: '' })
  }

  const handleStartTestMode = () => {
    setIsTestMode(true)
    setIsExperimentStarted(true)
    setCurrentScreen('home')
  }

  const navigateTo = (screenName) => {
    setScreenHistory((history) => [...history, currentScreen])
    setCurrentScreen(screenName)
    recordLog('画面遷移', screenName, screenName, '')
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

  const stopAudio = (ref) => {
    if (ref.current) {
      ref.current.pause()
      ref.current.currentTime = 0
      ref.current = null
    }
  }

  useEffect(() => {
    if (currentScreen !== 'soundcheck') {
      stopAudio(soundcheckAudioRef)
    } else {
      const audio = new Audio(soundcheckAudioFile)
      audio.loop = true
      soundcheckAudioRef.current = audio
      audio.play().catch(() => {})
    }
  }, [currentScreen])

  useEffect(() => {
    if (currentScreen !== 'output_sound_1') {
      stopAudio(outputSoundAudioRef)
      setIsOutputSoundPlaying(false)
    }
  }, [currentScreen])

  const handleTextSend = (screenKey) => {
    recordLog('送信ボタン押下', screenKey, '送信', inputTextValue)
    setInputTextValue('')
    goHome()
  }

  const renderScreen = () => {
    if (!isExperimentStarted) {
      return <SubjectNameInput onStartExperiment={handleStartExperiment} onStartTestMode={handleStartTestMode} />
    }

    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigateTo} />

      case 'practice_text':
      case 'input_text':
        return (
          <ScreenLayout title={SCREEN_TITLES[currentScreen]} onBack={goBack} onHome={goHome}>
            <section className="centered-prompt-content">
              <p className="screen-description">以下の文章をテキスト入力してください。</p>
              <div className="prompt-image-wrap">
                <img className="prompt-image" src={currentScreen === 'practice_text' ? practiceTextImage : inputTextImage} alt="指示画像" />
              </div>
              <InputComposer
                value={inputTextValue}
                onChange={setInputTextValue}
                onSend={() => handleTextSend(currentScreen)}
              />
            </section>
          </ScreenLayout>
        )

      case 'practice_sound_1':
      case 'input_sound_1':
        const isActive = currentScreen === 'practice_sound_1' ? isPracticeMicActive : isInputMicActive
        const toggleMic = () => {
          const setter = currentScreen === 'practice_sound_1' ? setIsPracticeMicActive : setIsInputMicActive
          setter(!isActive)
          recordLog(!isActive ? 'マイク開始' : 'マイク停止', currentScreen, 'マイクボタン')
        }
        return (
          <ScreenLayout title={SCREEN_TITLES[currentScreen]} onBack={goBack} onHome={goHome}>
            <section className="centered-prompt-content">
              <p className="screen-description">以下の文章を音声入力してください。</p>
              <div className="prompt-image-wrap">
                <img className="prompt-image" src={currentScreen === 'practice_sound_1' ? practiceTextImage : inputTextImage} alt="指示画像" />
              </div>
              <div className="mic-button-container">
                <RoundActionButton
                  icon={isActive ? iconMic : iconMute}
                  backgroundColor={isActive ? '#FA6400' : '#F4F4F4'}
                  onClick={toggleMic}
                />
              </div>
            </section>
          </ScreenLayout>
        )

      case 'output_text_1':
        return (
          <ScreenLayout title={SCREEN_TITLES.output_text_1} onBack={goBack} onHome={goHome}>
            <section className="centered-prompt-content">
              <div className="prompt-image-wrap">
                <img className="prompt-image" src={outputTextImage} alt="テキスト出力" />
              </div>
              <div className="check-button-container">
                <RoundActionButton
                  icon={isOutputTextChecked ? iconCheckWhite : iconCheckBlack}
                  backgroundColor={isOutputTextChecked ? '#FA6400' : '#F4F4F4'}
                  onClick={() => {
                    setIsOutputTextChecked(!isOutputTextChecked)
                    recordLog('チェックボタン押下', 'output_text_1', 'チェック')
                  }}
                />
              </div>
            </section>
          </ScreenLayout>
        )

      case 'soundcheck':
      case 'output_sound_1':
        const isOutput = currentScreen === 'output_sound_1'
        const play = () => {
          if (isOutput) {
            if (isOutputSoundPlaying) return
            const audio = new Audio(outputSoundAudioFile)
            outputSoundAudioRef.current = audio
            setIsOutputSoundPlaying(true)
            audio.onended = () => setIsOutputSoundPlaying(false)
            audio.play().catch(() => setIsOutputSoundPlaying(false))
          } else {
            soundcheckAudioRef.current.currentTime = 0
            soundcheckAudioRef.current.play()
          }
          recordLog('音声再生開始', currentScreen, '再生ボタン')
        }
        return (
          <ScreenLayout title={SCREEN_TITLES[currentScreen]} onBack={goBack} onHome={goHome}>
            <section className="centered-text-content">
              <p className="screen-description">
                {isOutput ? "以下のボタンを押して、音声を聞いてください。" : "聞きやすい音量に調節してください。"}
              </p>
              <div className="play-button-container">
                <RoundActionButton
                  icon={isOutput && isOutputSoundPlaying ? iconPlayWhite : iconPlayBlack}
                  backgroundColor={isOutput && isOutputSoundPlaying ? '#FA6400' : '#F4F4F4'}
                  onClick={play}
                />
              </div>
            </section>
          </ScreenLayout>
        )

      default:
        return <HomeScreen onNavigate={navigateTo} />
    }
  }

  return <div className="app-shell">{renderScreen()}</div>
}

export default App
