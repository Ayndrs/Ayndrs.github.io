import { StrictMode, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { extend } from '@react-three/fiber';

import SceneManager from './scenes/SceneManager.jsx'
import Cursor from './components/Cursor.jsx'
import Navbar from './components/Navbar.jsx'
import Socials from './components/Socials.jsx'
import { SceneProvider } from './contexts/SceneContext.jsx'

import './styles/style.css'

export default function App() {
  return (
    <StrictMode>
      <SceneProvider>
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
            <SceneManager />
        </Suspense>
        </Canvas>
      </SceneProvider>
    </StrictMode>
  );
}