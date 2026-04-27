/* src/components/Home.jsx */
import './Home.css';

const HOME_BUTTONS = [
  { key: 'practice_text_1', label: ['練習', 'テキスト入力'], tone: 'peach' },
  { key: 'practice_sound_1', label: ['練習', '音声入力'], tone: 'peach' },
  { key: 'input_text_1', label: ['テキスト入力'], tone: 'peach' },
  { key: 'input_sound_1', label: ['音声入力'], tone: 'peach' },
  { key: 'soundcheck', label: ['音声チェック'], tone: 'blue' },
  { key: 'output_text_1', label: ['テキスト出力'], tone: 'blue' },
  { key: 'output_sound_1', label: ['音声出力'], tone: 'blue' },
];

const HomeScreen = ({ onNavigate }) => {
  return (
    <div className="home-container">
      <h1 className="home-title">
        利用する機能を選択して<br />ください
      </h1>
      <div className="home-grid">
        {HOME_BUTTONS.map((btn) => (
          <button
            key={btn.key}
            className={`home-card home-card-${btn.tone}`}
            onClick={() => onNavigate(btn.key)}
          >
            <div className="home-card-label">
              {btn.label.map((line, index) => (
                <span key={index}>{line}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
