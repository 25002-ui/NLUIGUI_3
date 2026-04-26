import './ScreenHeader.css'

export default function ScreenHeader({ title, onBack, onHome }) {
  return (
    <div className="screen-header">
      <button className="header-icon-btn back-btn" onClick={onBack}>
        <img src="/material/icon_back.png" alt="Back" />
      </button>
      <h1 className="header-title">{title}</h1>
      <button className="header-icon-btn home-btn" onClick={onHome}>
        <img src="/material/icon_home.png" alt="Home" />
      </button>
    </div>
  )
}
