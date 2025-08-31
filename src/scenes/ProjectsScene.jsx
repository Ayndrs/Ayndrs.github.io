import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Environment, Float, Box, Text } from '@react-three/drei'
import * as THREE from 'three'

export default function ProjectsScene() {
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
        const yMaxRotation = 0.015
        const xMaxRotation = 0.03

        const targetX = mouse.current.y * yMaxRotation    
        const targetY = -mouse.current.x * xMaxRotation   

        camera.rotation.x += (targetX - camera.rotation.x) * 0.03
        camera.rotation.y += (targetY - camera.rotation.y) * 0.03

        // floating animation
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2
        }
    })

    return (
        <>
            <color attach="background" args={['#1a1a2e']} />
            
            <Environment preset="night" />
            
            <ambientLight intensity={0.8} color={'#4a90e2'} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} color={'#4a90e2'} />
            <pointLight position={[-5, 5, -5]} intensity={1} color={'#e24a4a'} />

            <group ref={groupRef}>
                <Float
                    speed={3} 
                    rotationIntensity={0.5} 
                    floatIntensity={0.5} 
                    floatingRange={[-0.1, 0.1]} 
                >
                    <Text
                        position={[-2, 2, 0]}
                        fontSize={1}
                        color="#4a90e2"
                        anchorX="center"
                        anchorY="middle"
                    >
                        PROJECTS
                    </Text>
                </Float>

                {/* Project cubes */}
                <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
                    <Box args={[1, 1, 1]} position={[-3, -1, 0]}>
                        <meshStandardMaterial color="#e24a4a" />
                    </Box>
                </Float>

                <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.3}>
                    <Box args={[1, 1, 1]} position={[0, -1, 0]}>
                        <meshStandardMaterial color="#4ae24a" />
                    </Box>
                </Float>

                <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.5}>
                    <Box args={[1, 1, 1]} position={[3, -1, 0]}>
                        <meshStandardMaterial color="#e2e24a" />
                    </Box>
                </Float>

                {/* Additional floating elements */}
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                    <Box args={[0.5, 0.5, 0.5]} position={[-1, 1, 2]}>
                        <meshStandardMaterial color="#e24ae2" />
                    </Box>
                </Float>

                <Float speed={2.2} rotationIntensity={0.3} floatIntensity={0.4}>
                    <Box args={[0.5, 0.5, 0.5]} position={[1, 1, -2]}>
                        <meshStandardMaterial color="#4ae2e2" />
                    </Box>
                </Float>
            </group>
        </>
    )
}
