import { createContext, useContext, useState } from 'react'

const SceneContext = createContext()

export function SceneProvider({ children }) {
  const [currentScene, setCurrentScene] = useState('home')

  const changeScene = (sceneName) => {
    setCurrentScene(sceneName)
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
