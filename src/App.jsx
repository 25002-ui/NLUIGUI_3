import { useEffect, useState } from 'react'
import './App.css'
import SubjectNameInput from './components/SubjectNameInput'
import iconBack from '../material/icon_back.png'
import iconHome from '../material/icon_home.png'
import iconSend from '../material/icon_send.png'
import practiceTextImage from '../material/practice_text.png'
import inputTextImage from '../material/input_text.png'
import { addLog } from './utils/logger'

function App() {
  const [isExperimentStarted, setIsExperimentStarted] = useState(false)
  const [subjectName, setSubjectName] = useState('')
  const [currentScreen, setCurrentScreen] = useState('home')
  const [inputText, setInputText] = useState('')

  // キーボードの高さをリアルタイムで取得してCSS変数にセット
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const keyboardHeight = window.innerHeight - window.visualViewport.height;
      document.documentElement.style.setProperty('--keyboard-height', `${Math.max(0, keyboardHeight)}px`);
      // キーボードが出た時にブラウザが画面を勝手にスクロールするのを防ぐ
      window.scrollTo(0, 0);
    };

    window.visualViewport.addEventListener('resize', handleResize);
    return () => window.visualViewport.removeEventListener('resize', handleResize);
  }, []);

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    setInputText('');
  };

  if (!isExperimentStarted) {
    return <SubjectNameInput onStartExperiment={(n) => { setSubjectName(n); setIsExperimentStarted(true); }} />;
  }

  // --- ホーム画面 ---
  if (currentScreen === 'home') {
    return (
      <div className="screen-shell home-screen">
        <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>Home</h1>
        <div className="home-grid">
          <button className="home-card home-card-peach" onClick={() => navigateTo('practice_text_1')}>練習<br/>テキスト入力</button>
          <button className="home-card home-card-peach">練習<br/>音声入力</button>
          <button className="home-card home-card-peach" onClick={() => navigateTo('input_text_1')}>テキスト入力</button>
          <button className="home-card home-card-peach">音声入力</button>
          <button className="home-card home-card-blue home-card-offset">音声チェック</button>
          <button className="home-card home-card-blue">テキスト出力</button>
          <button className="home-card home-card-blue">音声出力</button>
        </div>
      </div>
    );
  }

  // --- 入力ページ共通ロジック ---
  const isStep2 = currentScreen.endsWith('_2');
  const isPractice = currentScreen.startsWith('practice');
  const title = isPractice ? "練習　テキスト入力" : "テキスト入力";
  const imageSrc = isPractice ? practiceTextImage : inputTextImage;

  return (
    <div className="screen-shell">
      <header className="screen-header">
        <button className="header-icon-button" onClick={() => navigateTo('home')}><img src={iconBack} /></button>
        <h1 className="screen-title">{title}</h1>
        <button className="header-icon-button" onClick={() => navigateTo('home')}><img src={iconHome} /></button>
      </header>

      <main className="screen-main">
        <p className="screen-description">以下の文章をテキスト入力してください。</p>
        <div className="prompt-image-wrap">
          <img src={imageSrc} className="prompt-image" alt="お手本" />
        </div>
      </main>

      <footer className="screen-footer">
        {!isStep2 ? (
          <div className="bottom-input-box" onClick={() => navigateTo(currentScreen.replace('_1', '_2'))}>
            <span style={{ color: '#888' }}>文章を入力</span>
          </div>
        ) : (
          <div className="bottom-input-row">
            <input 
              className="bottom-input-field" 
              type="text" 
              autoFocus 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="文章を入力"
            />
            <button className="send-button" onClick={() => {
              addLog({ subjectName, screenName: currentScreen, actionName: '送信', inputText });
              navigateTo('home');
            }}>
              <img src={iconSend} />
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}

export default App;
