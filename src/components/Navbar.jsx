import { useScene } from '../contexts/SceneContext'
import { useState, useEffect } from 'react'
import '../styles/navbar.css'

export default function Navbar() {
  const { currentScene, changeScene } = useScene()
  const [isMobile, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      console.log('Mobile check:', mobile, 'Width:', window.innerWidth)
      setIsMobile(mobile)
      if (!mobile) {
        setIsMenuOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleNavClick = (scene) => {
    changeScene(scene)
    if (isMobile) {
      setIsMenuOpen(false)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobile) {
      if (isMenuOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen, isMobile])


  return (
    <nav className={`navbar ${currentScene === 'projects' ? 'light' : ''}`}>
      <div className="navbar-container">
        <ul className="navbar-left">
          <button 
            className={`nav-button ${currentScene === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            GOHYUN
          </button>
        </ul>
        
        {isMobile ? (
          <>
            <button 
              className="hamburger" 
              onClick={toggleMenu}
            >
              <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
            </button>
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
              <ul className="navbar-right">
                <li>
                  <button 
                    className={`nav-button ${currentScene === 'projects' ? 'active' : ''}`}
                    onClick={() => handleNavClick('projects')}
                  >
                    Projects
                  </button>
                </li>
                <li>
                  <button 
                    className={`nav-button ${currentScene === 'misc' ? 'active' : ''}`}
                    onClick={() => handleNavClick('misc')}
                  >
                    Misc
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <ul className="navbar-right">
            <li>
              <button 
                className={`nav-button ${currentScene === 'projects' ? 'active' : ''}`}
                onClick={() => handleNavClick('projects')}
              >
                Projects
              </button>
            </li>
            <li>
              <button 
                className={`nav-button ${currentScene === 'misc' ? 'active' : ''}`}
                onClick={() => handleNavClick('misc')}
              >
                Misc
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  )
}
