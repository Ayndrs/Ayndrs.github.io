import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Environment, Float, Sphere, Torus } from '@react-three/drei'
import * as THREE from 'three'

export default function MiscScene() {
    const { camera } = useThree()
    const mouse = useRef({ x: 0, y: 0 })
    const groupRef = useRef()

    useEffect(() => {
        const handleMouseMove = (event) => {
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useFrame((state) => {
        // camera movement
        const yMaxRotation = 0.02
        const xMaxRotation = 0.04

        const targetX = mouse.current.y * yMaxRotation    
        const targetY = -mouse.current.x * xMaxRotation   

        camera.rotation.x += (targetX - camera.rotation.x) * 0.04
        camera.rotation.y += (targetY - camera.rotation.y) * 0.04

        // rotating group
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
        }
    })

    return (
        <>
            <color attach="background" args={['#2d1b69']} />
            
            <Environment preset="sunset" />
            
            <ambientLight intensity={0.6} color={'#ff6b9d'} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} color={'#ff6b9d'} />
            <pointLight position={[-5, 5, -5]} intensity={0.8} color={'#9d6bff'} />

            <group ref={groupRef}>
                <Float
                    speed={4} 
                    rotationIntensity={0.8} 
                    floatIntensity={0.6} 
                    floatingRange={[-0.15, 0.15]} 
                >
                    <Torus
                        args={[2, 0.3, 16, 100]}
                        position={[0, 0, 0]}
                    >
                        <meshStandardMaterial color="#ff6b9d" />
                    </Torus>
                </Float>

                {/* Floating spheres */}
                <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
                    <Sphere args={[0.3, 16, 16]} position={[-2, 2, 1]}>
                        <meshStandardMaterial color="#9d6bff" />
                    </Sphere>
                </Float>

                <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.4}>
                    <Sphere args={[0.4, 16, 16]} position={[2, -1, 2]}>
                        <meshStandardMaterial color="#6bff9d" />
                    </Sphere>
                </Float>

                <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.7}>
                    <Sphere args={[0.25, 16, 16]} position={[-1, -2, -1]}>
                        <meshStandardMaterial color="#ff9d6b" />
                    </Sphere>
                </Float>

                <Float speed={3} rotationIntensity={0.5} floatIntensity={0.3}>
                    <Sphere args={[0.35, 16, 16]} position={[1, 1, -2]}>
                        <meshStandardMaterial color="#6b9dff" />
                    </Sphere>
                </Float>

                {/* Additional geometric shapes */}
                <Float speed={2.2} rotationIntensity={0.7} floatIntensity={0.4}>
                    <Torus
                        args={[1, 0.2, 8, 50]}
                        position={[0, 3, 0]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <meshStandardMaterial color="#ff6b6b" />
                    </Torus>
                </Float>

                <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
                    <Torus
                        args={[0.8, 0.15, 6, 40]}
                        position={[0, -3, 0]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <meshStandardMaterial color="#6bff6b" />
                    </Torus>
                </Float>
            </group>
        </>
    )
}
