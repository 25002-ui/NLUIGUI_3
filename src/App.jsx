import { useEffect, useRef, useState } from 'react'
import './App.css'
import SubjectNameInput from './components/SubjectNameInput'
import iconBack from '../material/icon_back.png'
import iconHome from '../material/icon_home.png'
import iconSend from '../material/icon_send.png'
import iconSendWhite from '../material/icon_send_white.png'
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
  { key: 'practice_text_1', label: ['練習', 'テキスト入力'], tone: 'practice' },
  { key: 'practice_sound_1', label: ['練習', '音声入力'], tone: 'practice' },

  { key: 'input_text_1', label: ['テキスト入力'], tone: 'peach', singleLine: true },
  { key: 'input_sound_1', label: ['音声入力'], tone: 'peach', singleLine: true },

  {
    key: 'soundcheck',
    label: ['音声チェック'],
    tone: 'soundcheck',
    singleLine: true,
    rightColumnOnly: true,
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
    <ScreenLayout title="Home" className="home-screen">
      <h1 className="home-title">Home</h1>

      <div className="home-grid">
        {HOME_BUTTONS.map((button) => (
          <button
            key={button.key}
            className={[
              'home-card',
              `home-card-${button.tone}`,
              button.singleLine ? 'home-card-single' : '',
              button.rightColumnOnly ? 'home-card-right-column' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            type="button"
            onClick={() => onNavigate(button.key)}
          >
            <span className="home-card-label">
              {button.label.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </ScreenLayout>
  )
}

function PromptImage({ src, alt }) {
  return (
    <div className="prompt-image-wrap">
      <img className="prompt-image" src={src} alt={alt} />
    </div>
  )
}

function InputLauncher({ onClick }) {
  return (
    <button className="bottom-input-box" type="button" onClick={onClick}>
      <span>文章を入力</span>
    </button>
  )
}

function InputComposer({
  value,
  onChange,
  onSend,
  onTextInputLog,
  isSent = false,
}) {
  const previousValueRef = useRef(value)
  const textareaRef = useRef(null)

  useEffect(() => {
    previousValueRef.current = value
  }, [value])

  const handleFocus = () => {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  const logTextDiff = (beforeText, afterText, inputType) => {
    if (!onTextInputLog || beforeText === afterText) {
      return
    }

    let start = 0

    while (
      start < beforeText.length &&
      start < afterText.length &&
      beforeText[start] === afterText[start]
    ) {
      start += 1
    }

    let beforeEnd = beforeText.length - 1
    let afterEnd = afterText.length - 1

    while (
      beforeEnd >= start &&
      afterEnd >= start &&
      beforeText[beforeEnd] === afterText[afterEnd]
    ) {
      beforeEnd -= 1
      afterEnd -= 1
    }

    const addedText = afterText.slice(start, afterEnd + 1)
    const removedText = beforeText.slice(start, beforeEnd + 1)

    if (addedText) {
      Array.from(addedText).forEach((char, index) => {
        onTextInputLog({
          inputChar: char,
          inputType: inputType || 'insertText',
          charIndex: start + index,
          beforeText,
          afterText,
        })
      })
    } else if (removedText) {
      Array.from(removedText).forEach((char, index) => {
        onTextInputLog({
          inputChar: char,
          inputType: inputType || 'deleteContent',
          charIndex: start + index,
          beforeText,
          afterText,
        })
      })
    }
  }

  const handleChange = (event) => {
    const nextValue = event.target.value
    const beforeValue = previousValueRef.current
    const inputType = event.nativeEvent?.inputType || 'textChange'

    logTextDiff(beforeValue, nextValue, inputType)

    previousValueRef.current = nextValue
    onChange(nextValue)
  }

  const handleSend = () => {
    const currentText = textareaRef.current?.value ?? value
    onSend(currentText)
  }

  return (
    <div className="input-composer">
      <textarea
        ref={textareaRef}
        className="input-textarea"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        rows={1}
        onInput={(event) => {
          event.currentTarget.style.height = 'auto'
          event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`
        }}
      />

      <button
        type="button"
        className={`send-button ${isSent ? 'is-sent' : ''}`}
        onClick={handleSend}
      >
        <img src={isSent ? iconSendWhite : iconSend} alt="送信" />
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

function PromptScreen({
  title,
  description,
  image,
  imageAlt,
  onBack,
  onHome,
  footer,
  className,
}) {
  return (
    <ScreenLayout title={title} onBack={onBack} onHome={onHome} className={className}>
      <section className="prompt-stack">
        {description ? <p className="screen-description">{description}</p> : null}
        <PromptImage src={image} alt={imageAlt} />
      </section>
      <div className="screen-footer">{footer}</div>
    </ScreenLayout>
  )
}

function TextOnlyScreen({
  title,
  description,
  body,
  onBack,
  onHome,
  footer,
}) {
  return (
    <ScreenLayout title={title} onBack={onBack} onHome={onHome}>
      <section className="text-content-block">
        <p className="screen-description">{description}</p>
        {body ? <div className="screen-body-copy">{body}</div> : null}
      </section>
      <div className="screen-footer">{footer}</div>
    </ScreenLayout>
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
  const [practiceTextSent, setPracticeTextSent] = useState(false)
  const [inputTextSent, setInputTextSent] = useState(false)
  const [isPracticeMicActive, setIsPracticeMicActive] = useState(false)
  const [isInputMicActive, setIsInputMicActive] = useState(false)
  const [isOutputTextChecked, setIsOutputTextChecked] = useState(false)
  const [isOutputSoundPlaying, setIsOutputSoundPlaying] = useState(false)

  const soundcheckAudioRef = useRef(null)
  const outputSoundAudioRef = useRef(null)

  // ログを記録するヘルパー関数
const recordLog = (
  actionName,
  screenName = currentScreen,
  buttonName = '',
  inputText = '',
  extraData = {}
) => {
  if (isTestMode) {
    return
  }

  addLog({
    subjectName,
    screenName,
    actionName,
    buttonName,
    inputText,
    ...extraData,
  })
}
  const handleStartExperiment = (name) => {
    setSubjectName(name)
    setIsTestMode(false)
    setIsExperimentStarted(true)
    // 実験開始をログに記録
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
    // テストモードではログを記録しない
  }

  const navigateTo = (screenName) => {
    if (screenName === 'practice_text_1') {
  setPracticeTextSent(false)
}

if (screenName === 'input_text_1') {
  setInputTextSent(false)
}
    if (screenName === 'practice_sound_1') {
      setIsPracticeMicActive(false)
    }

    // 画面遷移をログに記録
    recordLog('画面遷移', screenName, screenName, '')

    setScreenHistory((history) => [...history, currentScreen])
    setCurrentScreen(screenName)
  }

  const goBack = () => {
    // 戻るボタン押下をログに記録
    recordLog('戻るボタン押下')

    setScreenHistory((history) => {
      if (history.length === 0) {
        return history
      }

      const nextHistory = history.slice(0, -1)
      setCurrentScreen(history[history.length - 1])
      return nextHistory
    })
  }

  const goHome = () => {
    // Homeボタン押下をログに記録
    recordLog('Homeボタン押下')

    setCurrentScreen('home')
    setScreenHistory([])
  }

  const stopSoundcheckAudio = () => {
    if (!soundcheckAudioRef.current) {
      return
    }

    soundcheckAudioRef.current.pause()
    soundcheckAudioRef.current.currentTime = 0
    soundcheckAudioRef.current = null
  }

  const stopOutputSoundAudio = () => {
    if (outputSoundAudioRef.current) {
      outputSoundAudioRef.current.pause()
      outputSoundAudioRef.current.currentTime = 0
      outputSoundAudioRef.current.onended = null
      outputSoundAudioRef.current.onerror = null
      outputSoundAudioRef.current = null
    }

    setIsOutputSoundPlaying(false)
  }

  useEffect(() => {
    if (!window.visualViewport) {
      return undefined
    }

    const updateKeyboardInset = () => {
      const inset = Math.max(
        0,
        window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop,
      )
      document.documentElement.style.setProperty('--keyboard-inset', `${inset}px`)
    }

    updateKeyboardInset()
    window.visualViewport.addEventListener('resize', updateKeyboardInset)
    window.visualViewport.addEventListener('scroll', updateKeyboardInset)

    return () => {
      window.visualViewport.removeEventListener('resize', updateKeyboardInset)
      window.visualViewport.removeEventListener('scroll', updateKeyboardInset)
    }
  }, [])

  useEffect(() => {
    if (currentScreen !== 'soundcheck') {
      stopSoundcheckAudio()
      return undefined
    }

    // soundcheck 画面表示をログに記録
    recordLog('画面表示', 'soundcheck')

    const audio = new Audio(soundcheckAudioFile)
    audio.loop = true
    soundcheckAudioRef.current = audio
    audio.play().catch(() => {})

    return () => {
      if (soundcheckAudioRef.current === audio) {
        stopSoundcheckAudio()
      } else {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [currentScreen])

  useEffect(() => {
    if (currentScreen === 'output_sound_1') {
      return undefined
    }

    stopOutputSoundAudio()
    return undefined
  }, [currentScreen])

  useEffect(() => {
    // output_text_1 画面表示をログに記録
    if (currentScreen === 'output_text_1') {
      recordLog('画面表示', 'output_text_1')
    }
  }, [currentScreen])

  const replaySoundcheck = () => {
    if (!soundcheckAudioRef.current) {
      return
    }

    // soundcheck 再生ボタン押下をログに記録
    recordLog('音声再生開始', 'soundcheck', '再生ボタン', '')

    soundcheckAudioRef.current.currentTime = 0
    soundcheckAudioRef.current.play().catch(() => {})
  }

  const playOutputSound = () => {
    if (isOutputSoundPlaying) {
      return
    }

    stopOutputSoundAudio()

    const audio = new Audio(outputSoundAudioFile)
    outputSoundAudioRef.current = audio
    setIsOutputSoundPlaying(true)

    // 音声再生開始をログに記録
    recordLog('音声再生開始', 'output_sound_1', '再生ボタン', '')

    const finishPlayback = () => {
      if (outputSoundAudioRef.current === audio) {
        outputSoundAudioRef.current = null
      }
      // 音声再生終了をログに記録
      recordLog('音声再生終了', 'output_sound_1', '', '')
      setIsOutputSoundPlaying(false)
    }

    audio.onended = finishPlayback
    audio.onerror = finishPlayback
    audio.play().catch(finishPlayback)
  }

  const handlePracticeTextSend = () => {
  const sentText = practiceTextValue

  recordLog(
    '送信時全文ログ',
    'practice_text_1',
    '送信',
    '',
    {
      inputChar: sentText,
    }
  )

  recordLog('送信ボタン押下', 'practice_text_1', '送信')

  setPracticeTextSent(true)
  setPracticeTextValue('')
}

  const handleInputTextSend = (sentTextFromTextarea = '') => {
  const sentText = sentTextFromTextarea

  recordLog(
    '送信時全文ログ',
    'input_text_1',
    '送信',
    sentText,
    {
      inputChar: sentText,
    }
  )

  recordLog(
    '送信ボタン押下',
    'input_text_1',
    '送信',
    sentText,
    {
      inputChar: sentText,
    }
  )

  setInputTextSent(true)
  setInputTextValue('')
}

  const handlePracticeTextBoxClick = () => {
    // practice_text_1 テキストボックス押下をログに記録
    recordLog('テキストボックス押下', 'practice_text_1', 'テキストボックス', '')
    navigateTo('practice_text_2')
  }

  const handleInputTextBoxClick = () => {
    // input_text_1 テキストボックス押下をログに記録
    recordLog('テキストボックス押下', 'input_text_1', 'テキストボックス', '')
    navigateTo('input_text_2')
  }

  const handlePracticeMicToggle = () => {
    const newState = !isPracticeMicActive
    setIsPracticeMicActive(newState)

    // マイク ON/OFF をログに記録
    const actionName = newState ? 'マイク開始' : 'マイク停止'
    recordLog(actionName, 'practice_sound_1', 'マイクボタン', '')
  }

  const handleInputMicToggle = () => {
    const newState = !isInputMicActive
    setIsInputMicActive(newState)

    // マイク ON/OFF をログに記録
    const actionName = newState ? 'マイク開始' : 'マイク停止'
    recordLog(actionName, 'input_sound_1', 'マイクボタン', '')
  }

  const handleOutputTextCheckToggle = () => {
    setIsOutputTextChecked(!isOutputTextChecked)

    // チェックボタン押下をログに記録
    recordLog('チェックボタン押下', 'output_text_1', 'チェック', '')
  }

  const renderScreen = () => {
    if (!isExperimentStarted) {
      return (
        <SubjectNameInput
          onStartExperiment={handleStartExperiment}
          onStartTestMode={handleStartTestMode}
        />
      )
    }

    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigateTo} />

      case 'practice_text_1':
  return (
    <PromptScreen
      title={SCREEN_TITLES.practice_text_1}
      description="以下の文章をテキスト入力してください。"
      image={practiceTextImage}
      imageAlt="練習テキスト入力の説明"
      onBack={goBack}
      onHome={goHome}
      className="compose-screen compose-text-entry"
      footer={
        <InputComposer
          value={practiceTextValue}
          onChange={setPracticeTextValue}
          onSend={handlePracticeTextSend}
          isSent={practiceTextSent}
          onTextInputLog={(data) =>
            recordLog(
              '文字入力',
              'practice_text_1',
              'テキストボックス',
              data.afterText,
              data
            )
          }
        />
      }
    />
  )

      case 'input_text_1':
  return (
    <PromptScreen
      title={SCREEN_TITLES.input_text_1}
      description="以下の文章をテキスト入力してください。"
      image={inputTextImage}
      imageAlt="テキスト入力の説明"
      onBack={goBack}
      onHome={goHome}
      className="compose-screen compose-text-entry"
      footer={
        <InputComposer
          value={inputTextValue}
          onChange={setInputTextValue}
          onSend={handleInputTextSend}
          isSent={inputTextSent}
          onTextInputLog={(data) =>
            recordLog(
              '文字入力',
              'input_text_1',
              'テキストボックス',
              data.afterText,
              data
            )
          }
        />
      }
    />
  )

      case 'practice_sound_1':
        return (
          <PromptScreen
            title={SCREEN_TITLES.practice_sound_1}
            description="以下の文章を音声入力してください。"
            image={practiceTextImage}
            imageAlt="練習音声入力の説明"
            onBack={goBack}
            onHome={goHome}
            footer={
              <RoundActionButton
                icon={isPracticeMicActive ? iconMic : iconMute}
                alt="練習音声入力"
                backgroundColor="#F4F4F4"
                onClick={handlePracticeMicToggle}
              />
            }
          />
        )

      case 'input_sound_1':
        return (
          <PromptScreen
            title={SCREEN_TITLES.input_sound_1}
            description="以下の文章を音声入力してください。"
            image={inputTextImage}
            imageAlt="音声入力の説明"
            onBack={goBack}
            onHome={goHome}
            footer={
              <RoundActionButton
                icon={isInputMicActive ? iconMic : iconMute}
                alt="音声入力"
                backgroundColor={isInputMicActive ? '#F4F4F4' : '#E5E5E5'}
                onClick={handleInputMicToggle}
              />
            }
          />
        )

      case 'output_text_1':
        return (
          <PromptScreen
            title={SCREEN_TITLES.output_text_1}
            image={outputTextImage}
            imageAlt="テキスト出力の文章"
            onBack={goBack}
            onHome={goHome}
            footer={
              <RoundActionButton
                icon={isOutputTextChecked ? iconCheckWhite : iconCheckBlack}
                alt="テキスト出力確認"
                backgroundColor={isOutputTextChecked ? '#FA6400' : '#F4F4F4'}
                onClick={handleOutputTextCheckToggle}
              />
            }
          />
        )

      case 'soundcheck':
        return (
          <TextOnlyScreen
            title={SCREEN_TITLES.soundcheck}
            description="聞きやすい音量に調節してください。"
            body={null}
            onBack={goBack}
            onHome={goHome}
            footer={
              <RoundActionButton
                icon={iconPlayWhite}
                alt="音声チェック再生"
                backgroundColor="#FA6400"
                onClick={replaySoundcheck}
              />
            }
          />
        )

      case 'output_sound_1':
        return (
          <TextOnlyScreen
            title={SCREEN_TITLES.output_sound_1}
            description="以下のボタンを押して、音声を聞いてください。"
            body={null}
            onBack={goBack}
            onHome={goHome}
            footer={
              <RoundActionButton
                icon={isOutputSoundPlaying ? iconPlayWhite : iconPlayBlack}
                alt="音声出力再生"
                backgroundColor={isOutputSoundPlaying ? '#FA6400' : '#F4F4F4'}
                onClick={playOutputSound}
              />
            }
          />
        )

      default:
        return <HomeScreen onNavigate={navigateTo} />
    }
  }

  return <div className="app-shell">{renderScreen()}</div>
}

export default App
