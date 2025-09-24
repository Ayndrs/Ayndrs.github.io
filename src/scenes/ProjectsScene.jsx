import { useRef, useEffect, useMemo, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Environment, useTexture, Text } from '@react-three/drei'
import { useScene } from '../contexts/SceneContext'
import * as THREE from 'three'

function ProjectCard({ position = [0, 0, 0], rotation = [0, 0, 0], imageSrc, title, url, isActive, cardSize = [4, 2.3], titleSize = 0.175, enableHover = true }) {
    const texture = useTexture(imageSrc)
    // Ensure correct color management for textures so they don't look dark on mobile
    useEffect(() => {
        if (texture) {
            texture.colorSpace = THREE.SRGBColorSpace
            texture.needsUpdate = true
        }
    }, [texture])
    const materialRef = useRef()
    const hoverProgress = useRef(0)
    const hoverTarget = useRef(0)
    const shader = useMemo(() => ({
        uniforms: {
            uTime: { value: 0 },
            uTex: { value: texture },
            uAmplitude: { value: 0.03 },
            uFrequency: { value: new THREE.Vector2(2.0, 3.0) },
            uSpeed: { value: 0.8 },
            uHover: { value: 0.0 },
        },
        vertexShader: `
            uniform float uTime;
            uniform float uAmplitude;
            uniform vec2 uFrequency;
            uniform float uSpeed;
            uniform float uHover;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                vec3 pos = position;
                float scale = 1.0 + uHover * 0.06;
                pos.x *= scale;
                pos.y *= scale;
                float wave = sin((uv.x * uFrequency.x + uTime * uSpeed) * 6.28318) *
                             cos((uv.y * uFrequency.y + uTime * uSpeed) * 6.28318);
                pos.z += wave * (uAmplitude * (1.0 + uHover * 0.8));
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D uTex;
            uniform float uHover;
            varying vec2 vUv;
            void main() {
                vec2 centered = vUv - 0.5;
                float zoom = mix(1.0, 0.85, clamp(uHover, 0.0, 1.0));
                vec2 zoomUv = centered * zoom + 0.5;
                vec4 c = texture2D(uTex, zoomUv);
                c.rgb *= mix(1.0, 1.06, uHover);
                gl_FragColor = c;
            }
        `,
    }), [texture])

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
            hoverProgress.current = THREE.MathUtils.lerp(hoverProgress.current, hoverTarget.current, 0.15)
            materialRef.current.uniforms.uHover.value = hoverProgress.current
        }
    })

    const handleClick = () => {
        if (url && isActive) window.open(url, '_blank', 'noreferrer')
    }

    const handleOver = () => {
        if (!enableHover) return
        document.body.style.cursor = 'pointer'
        hoverTarget.current = 1
    }

    const handleOut = () => {
        if (!enableHover) return
        document.body.style.cursor = 'default'
        hoverTarget.current = 0
    }

    return (
        <group position={position} rotation={rotation}>
            <mesh onClick={handleClick} onPointerOver={isActive ? handleOver : undefined} onPointerOut={isActive ? handleOut : undefined}>
                <planeGeometry args={[cardSize[0], cardSize[1], 128, 128]} />
                <shaderMaterial ref={materialRef} args={[shader]} toneMapped={false} />
            </mesh>
            <Text
                position={[0, -(cardSize[1] + 0.2) * 0.5, 0.01]}
                color="#111111"
                font={'/fonts/Poppins-Medium.ttf'}
                fontSize={titleSize}
                anchorX="center"
                anchorY="top"
            >
                {title}
            </Text>
        </group>
    )
}

export default function ProjectsScene() {
    const { camera, size } = useThree()
    const mouse = useRef({ x: 0, y: 0 })
    const groupRef = useRef()
    const [scroll, setScroll] = useState(0)
    const scrollTarget = useRef(0)
    const isMobile = size.width < 768
    const spacingX = isMobile ? 3.8 : 4.8
    const spacingY = isMobile ? 3.0 : 3.2
    // Shift grid up a bit to reduce top whitespace and extend scroll to reduce bottom whitespace
    const baseOffset = isMobile ? -2: -1
    const { currentScene } = useScene()
    const projects = [
        { src: '/MrRecipe.png', title: 'Mr. Recipe', url: 'https://github.com/ewbyf/MrRecipe' },
        { src: '/Bocchi.png', title: 'Bocchi Guesser', url: 'https://github.com/Ayndrs/Bocchi-Guesser' },
        { src: '/idk.png', title: 'Coming Soon', url: '' },
        { src: '/idk.png', title: 'Coming Soon', url: '' },
    ]
    const columns = isMobile ? 1 : 2
    const rows = Math.ceil(projects.length / columns)
    const maxScroll = Math.max(0, (rows - 1) * spacingY + baseOffset)

    useEffect(() => {
        const handleMouseMove = (event) => {
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
        }

        const handleTouchMove = (event) => {
            if (event.touches.length > 0) {
                const t = event.touches[0]
                mouse.current.x = (t.clientX / window.innerWidth) * 2 - 1
                mouse.current.y = -(t.clientY / window.innerHeight) * 2 + 1
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('touchmove', handleTouchMove, { passive: true })
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('touchmove', handleTouchMove)
        }
    }, [])

    useEffect(() => {
        const wheelFactor = isMobile ? 0.005 : 0.0025
        const onWheel = (e) => {
            scrollTarget.current = Math.min(
                Math.max(0, scrollTarget.current + e.deltaY * wheelFactor * spacingY),
                maxScroll
            )
        }
        const onTouchStart = (e) => {
            if (e.touches.length > 0) {
                onTouchStart.lastY = e.touches[0].clientY
            }
        }
        const onTouchMove = (e) => {
            if (e.touches.length > 0 && onTouchStart.lastY != null) {
                const dy = onTouchStart.lastY - e.touches[0].clientY
                onTouchStart.lastY = e.touches[0].clientY
                const touchFactor = isMobile ? 0.03 : 0.01
                scrollTarget.current = Math.min(
                    Math.max(0, scrollTarget.current + dy * touchFactor),
                    maxScroll
                )
            }
        }
        window.addEventListener('wheel', onWheel, { passive: true })
        window.addEventListener('touchstart', onTouchStart, { passive: true })
        window.addEventListener('touchmove', onTouchMove, { passive: true })
        return () => {
            window.removeEventListener('wheel', onWheel)
            window.removeEventListener('touchstart', onTouchStart)
            window.removeEventListener('touchmove', onTouchMove)
        }
    }, [maxScroll, spacingY, isMobile])

    useFrame((state) => {
        const yMaxRotation = isMobile ? 0.008 : 0.015
        const xMaxRotation = isMobile ? 0.02 : 0.03

        const targetX = mouse.current.y * yMaxRotation    
        const targetY = -mouse.current.x * xMaxRotation   

        camera.rotation.x += (targetX - camera.rotation.x) * 0.03
        camera.rotation.y += (targetY - camera.rotation.y) * 0.03

        // smooth scroll easing
        const ease = isMobile ? 0.12 : 0.08
        const newScroll = THREE.MathUtils.lerp(scroll, scrollTarget.current, ease)
        setScroll(newScroll)
        if (groupRef.current) {
            groupRef.current.position.y = newScroll - baseOffset
        }
    })

    return (
        <>
            <Environment preset="city" />
            <ambientLight intensity={0.9} color={'#ffffff'} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} color={'#ffffff'} />

            <group ref={groupRef}>
                {projects.map((p, i) => {
                    const col = i % columns
                    const row = Math.floor(i / columns)
                    const x = columns === 1 ? 0 : (col === 0 ? -spacingX * 0.5 : spacingX * 0.5)
                    const y = -row * spacingY
                    const cardSize = isMobile ? [3.8, 2.25] : [4.0, 2.3]
                    const titleSize = isMobile ? 0.18 : 0.175
                    const enableHover = !isMobile
                    return (
                        <ProjectCard
                            key={i}
                            position={[x, y, 0]}
                            rotation={[-0.03, 0.0, 0]}
                            imageSrc={p.src}
                            title={p.title}
                            url={p.url}
                            isActive={currentScene === 'projects'}
                            cardSize={cardSize}
                            titleSize={titleSize}
                            enableHover={enableHover}
                        />
                    )
                })}
            </group>
        </>
    )
}
