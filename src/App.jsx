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
  const [practiceTextValue, setPracticeTextValue] = useState('')
  const [inputTextValue, setInputTextValue] = useState('')
  const [isPracticeMicActive, setIsPracticeMicActive] = useState(false)
  const [isInputMicActive, setIsInputMicActive] = useState(false)
  const [isOutputTextChecked, setIsOutputTextChecked] = useState(false)
  const [isOutputSoundPlaying, setIsOutputSoundPlaying] = useState(false)

  const soundcheckAudioRef = useRef(null)
  const outputSoundAudioRef = useRef(null)

  useEffect(() => {
    const handleViewportChange = () => {
      if (!window.visualViewport) return;
      const offset = window.innerHeight - window.visualViewport.height;
      document.documentElement.style.setProperty('--keyboard-inset', `${Math.max(0, offset)}px`);
    };
    window.visualViewport?.addEventListener('resize', handleViewportChange);
    return () => window.visualViewport?.removeEventListener('resize', handleViewportChange);
  }, []);

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

  // ホーム画面
  if (currentScreen === 'home') {
    return (
      <div className="app-shell home-screen">
        <h1 className="home-title">Home</h1>
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

  // コンテンツの判定
  const isPractice = currentScreen.startsWith('practice');
  const isTextType = currentScreen.includes('text');
  const isSoundType = currentScreen.includes('sound') || currentScreen === 'soundcheck';
  const isStep2 = currentScreen.endsWith('_2');

  // 画像の選択
  let imageSrc = null;
  if (currentScreen.includes('practice_text')) imageSrc = practiceTextImage;
  else if (currentScreen.includes('input_text')) imageSrc = inputTextImage;
  else if (currentScreen.includes('output_text')) imageSrc = outputTextImage;
  else if (currentScreen.includes('practice_sound')) imageSrc = practiceTextImage;
  else if (currentScreen.includes('input_sound')) imageSrc = inputTextImage;

  return (
    <div className="app-shell">
      <header className="screen-header">
        <button className="header-icon-button" onClick={goBack}><img src={iconBack} alt="戻る" /></button>
        <h1 className="screen-title">{SCREEN_TITLES[currentScreen]}</h1>
        <button className="header-icon-button" onClick={goHome}><img src={iconHome} alt="ホーム" /></button>
      </header>

      <main className="screen-main">
        <section className="prompt-stack">
          {/* 説明文の表示 */}
          {!currentScreen.includes('output') && !currentScreen.includes('soundcheck') && (
            <p className="screen-description">以下の文章を{isTextType ? 'テキスト' : '音声'}入力してください。</p>
          )}
          {currentScreen === 'soundcheck' && <p className="screen-description">聞きやすい音量に調節してください。</p>}
          {currentScreen === 'output_sound_1' && <p className="screen-description">以下のボタンを押して、音声を聞いてください。</p>}

          {/* 画像の表示 */}
          {imageSrc && (
            <div className="prompt-image-wrap"><img className="prompt-image" src={imageSrc} alt="" /></div>
          )}

          {/* フッター要素（必要なものだけを出す） */}
          <div className="screen-footer">
            {/* テキスト入力画面の場合 */}
            {isTextType && !currentScreen.includes('output') && (
              !isStep2 ? (
                <button className="bottom-input-box" onClick={() => navigateTo(currentScreen.replace('_1', '_2'))}>
                  <span>文章を入力</span>
                </button>
              ) : (
                <div className="bottom-input-row">
                  <input className="bottom-input-field" type="text" placeholder="文章を入力" autoFocus value={isPractice ? practiceTextValue : inputTextValue} onChange={(e) => isPractice ? setPracticeTextValue(e.target.value) : setInputTextValue(e.target.value)} />
                  <button className="send-button" onClick={() => { recordLog('送信', currentScreen, '送信', isPractice ? practiceTextValue : inputTextValue); isPractice ? setPracticeTextValue('') : setInputTextValue(''); goBack(); }}><img src={iconSend} alt="" /></button>
                </div>
              )
            )}

            {/* 音声入力画面の場合 */}
            {isSoundType && currentScreen.includes('practice_sound') && (
              <button className="round-action-button" style={{backgroundColor: '#F4F4F4'}} onClick={() => setIsPracticeMicActive(!isPracticeMicActive)}>
                <img src={isPracticeMicActive ? iconMic : iconMute} alt="マイク" />
              </button>
            )}
            {isSoundType && currentScreen.includes('input_sound') && (
              <button className="round-action-button" style={{backgroundColor: isInputMicActive ? '#F4F4F4' : '#E5E5E5'}} onClick={() => setIsInputMicActive(!isInputMicActive)}>
                <img src={isInputMicActive ? iconMic : iconMute} alt="マイク" />
              </button>
            )}

            {/* 出力・チェック画面の場合 */}
            {currentScreen === 'output_text_1' && (
              <button className="round-action-button" style={{backgroundColor: isOutputTextChecked ? '#FA6400' : '#F4F4F4'}} onClick={() => setIsOutputTextChecked(!isOutputTextChecked)}>
                <img src={isOutputTextChecked ? iconCheckWhite : iconCheckBlack} alt="チェック" />
              </button>
            )}
            {currentScreen === 'soundcheck' && (
              <button className="round-action-button" style={{backgroundColor: '#FA6400'}} onClick={() => {}}>
                <img src={iconPlayWhite} alt="再生" />
              </button>
            )}
            {currentScreen === 'output_sound_1' && (
              <button className="round-action-button" style={{backgroundColor: isOutputSoundPlaying ? '#FA6400' : '#F4F4F4'}} onClick={() => setIsOutputSoundPlaying(!isOutputSoundPlaying)}>
                <img src={isOutputSoundPlaying ? iconPlayWhite : iconPlayBlack} alt="再生" />
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
