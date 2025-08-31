import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Experience from '../Experience.jsx'

export default function Misc() {
  return (
    <div className="page misc-page">
      <div className="page-content">
        <h1>Miscellaneous</h1>
        <p>Random thoughts, experiments, and other content.</p>
        
        <div className="misc-content">
          <div className="misc-section">
            <h3>Blog Posts</h3>
            <p>Coming soon...</p>
          </div>
          <div className="misc-section">
            <h3>Experiments</h3>
            <p>Coming soon...</p>
          </div>
          <div className="misc-section">
            <h3>Resources</h3>
            <p>Coming soon...</p>
          </div>
        </div>
      </div>
      
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 2000,
          position: [0, 0, 10],
        }}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
    </div>
  )
}
