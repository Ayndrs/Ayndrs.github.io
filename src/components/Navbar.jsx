import { useScene } from '../contexts/SceneContext'
import '../styles/navbar.css'

export default function Navbar() {
  const { currentScene, changeScene } = useScene()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-left">
          <button 
            className={`nav-button ${currentScene === 'home' ? 'active' : ''}`}
            onClick={() => changeScene('home')}
          >
            GOHYUN
          </button>
        </ul>
        <ul className="navbar-right">
          <li>
            <button 
              className={`nav-button ${currentScene === 'projects' ? 'active' : ''}`}
              onClick={() => changeScene('projects')}
            >
              Projects
            </button>
          </li>
          <li>
            <button 
              className={`nav-button ${currentScene === 'misc' ? 'active' : ''}`}
              onClick={() => changeScene('misc')}
            >
              Misc
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
