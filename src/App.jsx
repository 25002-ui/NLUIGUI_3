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
  { key: 'input_text_1', label: ['テキスト入力'], tone: 'peach' },
  { key: 'input_sound_1', label: ['音声入力'], tone: 'peach' },
  { key: 'soundcheck', label: ['音声チェック'], tone: 'blue', spacerBefore: true },
  { key: 'output_text_1', label: ['テキスト出力'], tone: 'blue' },
  { key: 'output_sound_1', label: ['音声出力'], tone: 'blue' },
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
  const [currentScreen, setCurrentScreen] = useState('home')
  const [screenHistory, setScreenHistory] = useState([])
  
  // ステート管理
  const [isOutputSoundPlaying, setIsOutputSoundPlaying] = useState(false)
  const [isOutputTextChecked, setIsOutputTextChecked] = useState(false)

  // Audioオブジェクトのリファレンス
  const soundcheckAudio = useRef(new Audio(soundcheckAudioFile))
  const outputAudio = useRef(new Audio(outputSoundAudioFile))

  // 音声再生の終了検知
  useEffect(() => {
    const handleEnd = () => setIsOutputSoundPlaying(false)
    const outAudio = outputAudio.current
    outAudio.addEventListener('ended', handleEnd)
    return () => outAudio.removeEventListener('ended', handleEnd)
  }, [])

  const navigateTo = (screenName) => {
    // 画面遷移時に音声を止める
    soundcheckAudio.current.pause()
    soundcheckAudio.current.currentTime = 0
    outputAudio.current.pause()
    outputAudio.current.currentTime = 0
    setIsOutputSoundPlaying(false)

    setScreenHistory((prev) => [...prev, currentScreen])
    setCurrentScreen(screenName)
  }

  const handlePlaySoundcheck = () => {
    soundcheckAudio.current.currentTime = 0
    soundcheckAudio.current.play().catch(e => console.error("再生失敗:", e))
  }

  const handlePlayOutputSound = () => {
    if (isOutputSoundPlaying) {
      outputAudio.current.pause()
      setIsOutputSoundPlaying(false)
    } else {
      outputAudio.current.currentTime = 0
      outputAudio.current.play().catch(e => console.error("再生失敗:", e))
      setIsOutputSoundPlaying(true)
    }
  }

  if (!isExperimentStarted) {
    return <SubjectNameInput onStartExperiment={(n) => { setSubjectName(n); setIsExperimentStarted(true); }} />
  }

  if (currentScreen === 'home') {
    return (
      <div className="app-shell home-screen">
        <h1 className="home-title">Home</h1>
        <div className="home-grid">
          {HOME_BUTTONS.map((b) => (
            <button 
              key={b.key} 
              className={`home-card home-card-${b.tone} ${b.spacerBefore ? 'home-card-offset' : ''}`} 
              onClick={() => navigateTo(b.key)}
            >
              <span className="home-card-label">
                {b.label.map(l => <span key={l}>{l}</span>)}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="screen-header">
        <button className="header-icon-button" onClick={() => setCurrentScreen(screenHistory.pop() || 'home')}>
          <img src={iconBack} alt="戻る" />
        </button>
        <h1 className="screen-title">{SCREEN_TITLES[currentScreen]}</h1>
        <button className="header-icon-button" onClick={() => {setCurrentScreen('home'); setScreenHistory([]);}}>
          <img src={iconHome} alt="ホーム" />
        </button>
      </header>

      <main className="screen-main">
        <div className="prompt-stack">
          {/* 画像表示ロジック */}
          {currentScreen.includes('text') && <img className="prompt-image" src={currentScreen.includes('practice') ? practiceTextImage : inputTextImage} alt="" />}
          
          {/* 各画面専用のUI */}
          {currentScreen === 'soundcheck' && (
            <>
              <p className="screen-description">聞きやすい音量に調節してください。</p>
              <button className="round-action-button" style={{backgroundColor: '#FA6400'}} onClick={handlePlaySoundcheck}>
                <img src={iconPlayWhite} alt="再生" />
              </button>
            </>
          )}

          {currentScreen === 'output_sound_1' && (
            <>
              <p className="screen-description">以下のボタンを押して、音声を聞いてください。</p>
              <button 
                className="round-action-button" 
                style={{backgroundColor: isOutputSoundPlaying ? '#FA6400' : '#F4F4F4'}} 
                onClick={handlePlayOutputSound}
              >
                <img src={isOutputSoundPlaying ? iconPlayWhite : iconPlayBlack} alt="再生" />
              </button>
            </>
          )}

          {currentScreen === 'output_text_1' && (
            <>
              <img className="prompt-image" src={outputTextImage} alt="" />
              <button 
                className="round-action-button" 
                style={{backgroundColor: isOutputTextChecked ? '#FA6400' : '#F4F4F4'}} 
                onClick={() => setIsOutputTextChecked(!isOutputTextChecked)}
              >
                <img src={isOutputTextChecked ? iconCheckWhite : iconCheckBlack} alt="チェック" />
              </button>
            </>
          )}

          {/* テキスト入力等の共通入力欄 (必要な時だけ) */}
          {(currentScreen === 'practice_text_1' || currentScreen === 'input_text_1') && (
            <button className="bottom-input-box" onClick={() => navigateTo(currentScreen.replace('_1', '_2'))}>
              <span>文章を入力</span>
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
