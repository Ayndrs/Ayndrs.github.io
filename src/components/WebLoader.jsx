import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'
import '../styles/customLoader.css'

export default function WebLoader() {
  const { progress, active } = useProgress()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (!active) {
      const timeout = setTimeout(() => setHidden(true), 500) 
      return () => clearTimeout(timeout)
    } else {
      setHidden(false)
    }
  }, [active])

  return (
    <div className={`loader-container ${hidden ? 'hidden' : ''}`}>
      <div className="loader-content">
        <div className="loader-bar" style={{ width: `${progress}%` }}></div>
        <p>Loading...</p>
      </div>
    </div>
  )
}
