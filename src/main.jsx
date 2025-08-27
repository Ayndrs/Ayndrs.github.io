import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import {Loader} from '@react-three/drei'
import Experience from './Experience.jsx'
import Cursor from './components/Cursor.jsx'
import Navbar from './components/Navbar.jsx'
import Socials from './components/Socials.jsx'

import './styles/style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Cursor />
    <Navbar />
    <Socials />
    <Canvas
        camera={ {
            fov: 45,
            near: 0.1,
            far: 2000,
            position: [ 0, 0, 10 ],
        } }
    >
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
    </Canvas>
    <Loader />
  </StrictMode>,
)
