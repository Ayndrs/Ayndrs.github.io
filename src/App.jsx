import { StrictMode, Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { extend } from '@react-three/fiber';

import SceneManager from './scenes/SceneManager.jsx'
import Cursor from './components/Cursor.jsx'
import Navbar from './components/Navbar.jsx'
import Socials from './components/Socials.jsx'
import { SceneProvider } from './contexts/SceneContext.jsx'
import RenderPassManager from './components/RenderPassManager.jsx'

import './styles/style.css'

export default function App() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <StrictMode>
      <SceneProvider>
        <Cursor />
        <Navbar />
        <Socials />
        <Canvas
            camera={ {
                fov: isMobile ? 60 : 45,
                near: 0.1,
                far: 2000,
                position: [ 0, 0, 10 ],
            } }
        >
        <Suspense fallback={null}>
            <RenderPassManager>
                <SceneManager />
            </RenderPassManager>
        </Suspense>
        </Canvas>
      </SceneProvider>
    </StrictMode>
  );
}