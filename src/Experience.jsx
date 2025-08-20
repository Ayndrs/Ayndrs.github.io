import { extend, useThree, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, Clouds, Cloud, useGLTF, Float } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import { Perf } from 'r3f-perf'
import { Name } from './shaders/name/Name.jsx'
import * as THREE from 'three'
import MainText from './components/MainText.jsx'
import Model from './components/Model.jsx'

extend({ Name })

export default function Experience() {
    const { camera } = useThree()
    const mouse = useRef({ x: 0, y: 0 })
    const directionalLight = useRef()

    // useHelper(directionalLight, THREE.DirectionalLightHelper, 1)

    useEffect(() => {
        const handleMouseMove = (event) => {
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useFrame((state) => {
        // camera
        const yMaxRotation = 0.025
        const xMaxRotation = 0.05

        const targetX = mouse.current.y * yMaxRotation    
        const targetY = -mouse.current.x * xMaxRotation   

        camera.rotation.x += (targetX - camera.rotation.x) * 0.05
        camera.rotation.y += (targetY - camera.rotation.y) * 0.05


        // directionalLight
        const time = state.clock.elapsedTime
        const radius = 5

        if (directionalLight.current) {
            directionalLight.current.position.x = Math.sin(time * 0.2) * radius
            directionalLight.current.position.z = -5
            directionalLight.current.position.y = 2  

            directionalLight.current.lookAt(0, 0, 0)
        }
    })

    return (
        <>
            {/* <Perf position="top-left" /> */}
            <color attach="background" args={['#0057b8']} />

            <Float >
                <Clouds material={THREE.MeshBasicMaterial}>
                    <Cloud position={[0, -7, 0]} segments={40} bounds={[10, 2, 2]} volume={10} color="white" />
                    <Cloud position={[0, -6, 0]} seed={1} scale={2} volume={5} color='white' fade={100} />
                </Clouds>
            </Float>
            {/* <OrbitControls /> */}
            <Environment preset="city" />

            <ambientLight intensity={1.5} color={'#b5e4ff'} />
            <directionalLight position={[0, -5, -10]} intensity={ 5 } color={'#b5e4ff'}/>
            <directionalLight ref={ directionalLight } position={[10, 0, -10]} intensity={ 10 } color={'#b5e4ff'}/>

            <Float
                speed={5} 
                rotationIntensity={0.25} 
                floatIntensity={1} 
                floatingRange={[-0.05, 0.05]} 
            >
                <MainText />
            </Float>

            <Model position={[0.5, -4.75, 3]}/>

        </>
    )
}
