import { createContext, useContext, useState, useEffect } from 'react'

const SceneContext = createContext()

export function SceneProvider({ children }) {
  const [currentScene, setCurrentScene] = useState('home')

  // Initialize scene from URL on mount
  useEffect(() => {
    const path = window.location.pathname.slice(1) // Remove leading slash
    const validScenes = ['projects', 'misc']
    
    if (validScenes.includes(path)) {
      setCurrentScene(path)
    } else {
      // If URL is empty (base URL) or doesn't match any scene, default to home
      setCurrentScene('home')
      if (path !== '') {
        window.history.replaceState(null, '', '/')
      }
    }
  }, [])

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1)
      const validScenes = ['projects', 'misc']
      
      if (validScenes.includes(path)) {
        setCurrentScene(path)
      } else {
        // Empty path or invalid path defaults to home
        setCurrentScene('home')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const changeScene = (sceneName) => {
    setCurrentScene(sceneName)
    // Update URL without page reload
    if (sceneName === 'home') {
      window.history.pushState(null, '', '/')
    } else {
      window.history.pushState(null, '', `/${sceneName}`)
    }
  }

  return (
    <SceneContext.Provider value={{ currentScene, changeScene }}>
      {children}
    </SceneContext.Provider>
  )
}

export function useScene() {
  const context = useContext(SceneContext)
  if (!context) {
    throw new Error('useScene must be used within a SceneProvider')
  }
  return context
}
