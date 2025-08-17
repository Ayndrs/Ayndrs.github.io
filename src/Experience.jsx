import { extend, useThree, useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { Perf } from 'r3f-perf'
import { Name } from './shaders/name/Name.jsx'

extend({ Name })

export default function Experience() {
    const { camera } = useThree()
    const mouse = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (event) => {
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useFrame(() => {
        const yMaxRotation = 0.025
        const xMaxRotation = 0.1
        const zMaxRotation = 0.05

        const targetX = mouse.current.y * yMaxRotation    
        const targetY = -mouse.current.x * xMaxRotation   
        const targetZ = -mouse.current.x * zMaxRotation

        camera.rotation.x += (targetX - camera.rotation.x) * 0.05
        camera.rotation.y += (targetY - camera.rotation.y) * 0.05
        camera.rotation.z += (targetZ - camera.rotation.z) * 0.05
    })

    return (
        <>
            <Perf position="top-left" />
            <color args={['#00aeff']} attach="background" />

            <Float
                speed={5} 
                rotationIntensity={0.25} 
                floatIntensity={1} 
                floatingRange={[-0.05, 0.05]} 
            >
                <Text
                    font="./fonts/Poppins-Medium.ttf"
                    fontSize={1}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    textAlign='center'
                    maxWidth={2}
                >
                    gohyun
                    <name ref={mouse} uColor="white" />
                </Text>
            </Float>
        </>
    )
}
