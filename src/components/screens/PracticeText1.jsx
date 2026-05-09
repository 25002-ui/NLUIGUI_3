import React from 'react';
import ScreenHeader from '../ScreenHeader';
import './PracticeText1.css';

const PracticeText1 = ({ navigateTo, goBack, goHome }) => {
  const handleInputClick = () => {
    navigateTo('practice_text_2');
  };

  return (
    <div className="screen-container">
      <div className="screen-wrapper">
        <ScreenHeader title="練習 テキスト入力" onBack={goBack} onHome={goHome} />

        <div className="screen-content">
          <img src="/material/practice_text.png" alt="Practice Text" className="content-image" />

          {/* 修正：画像のすぐ下にテキストボックスを配置 */}
          <button className="text-input-box" onClick={handleInputClick}>
            <span className="input-placeholder">文章を入力</span>
          </button>

          <div className="description">
            以下の文章をテキスト入力してください。
          </div>

          <div className="example-text">
            玉ねぎと中華麺を使った、ピリ辛料理を教えて。洗い物が少なくて、ネギは使わず、15分以内で作れる料理でできれば簡単にお願い。
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeText1;
