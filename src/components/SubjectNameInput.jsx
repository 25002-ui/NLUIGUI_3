import { useState } from 'react'
import './SubjectNameInput.css'

export default function SubjectNameInput({ onStartExperiment, onStartTestMode }) {
  const [subjectName, setSubjectName] = useState('')
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const value = e.target.value
    setSubjectName(value)
    if (error) {
      setError('')
    }
  }

  const handleStartClick = () => {
    if (!subjectName.trim()) {
      setError('学籍番号を入力')
      return
    }
    onStartExperiment(subjectName.trim())
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleStartClick()
    }
  }

  const handleTestClick = () => {
    onStartTestMode()
  }

  return (
    <div className="subject-name-input-container">
      <div className="subject-name-input-wrapper">
        <h1 className="subject-name-input-title">入力・出力操作実験</h1>

        <div className="subject-name-input-content">
          <label className="subject-name-input-label">学籍番号</label>
          <input
            type="text"
            className="subject-name-input-field"
            placeholder="学籍番号を入力してください"
            value={subjectName}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          {error && <div className="subject-name-input-error">{error}</div>}
        </div>

        <div className="subject-name-input-buttons">
          <button
            className={`subject-name-input-button start-button ${!subjectName.trim() ? 'disabled' : ''}`}
            onClick={handleStartClick}
            disabled={!subjectName.trim()}
            type="button"
          >
            開始
          </button>
          <button
            className="subject-name-input-button test-button"
            onClick={handleTestClick}
            type="button"
          >
            テスト
          </button>
        </div>
      </div>
    </div>
  )
}
