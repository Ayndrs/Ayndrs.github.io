import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import './style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Canvas
        camera={ {
            fov: 45,
            near: 0.1,
            far: 2000,
            position: [ 0, 0, 10 ]
        } }
    >
        <Experience />
    </Canvas>
  </StrictMode>,
)
