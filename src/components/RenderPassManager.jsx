import { useRef, useMemo, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScene } from '../contexts/SceneContext'

export default function RenderPassManager({ children }) {
    const { currentScene } = useScene()
    const { gl, scene, camera, size } = useThree()
    
    // Create render targets for each scene
    const renderTargets = useMemo(() => {
        const targets = {}
        const pixelRatio = window.devicePixelRatio
        const width = size.width * pixelRatio
        const height = size.height * pixelRatio
        
        // Create render targets for each scene
        ;['home', 'projects', 'misc'].forEach(sceneName => {
            targets[sceneName] = new THREE.WebGLRenderTarget(width, height, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                encoding: gl.outputEncoding,
                samples: 4
            })
        })
        
        return targets
    }, [size, gl])
    
    // Transition state
    const transitionState = useRef({
        isTransitioning: false,
        fromScene: null,
        toScene: null,
        progress: 0,
        duration: 1.2, // seconds
        startTime: 0,
        transitionType: 'fade' // 'fade', 'slide', 'zoom', 'wipe'
    })
    
    // Create a full-screen quad for displaying render targets
    const fullscreenQuad = useMemo(() => {
        const geometry = new THREE.PlaneGeometry(2, 2)
        const material = new THREE.ShaderMaterial({
            uniforms: {
                fromTexture: { value: null },
                toTexture: { value: null },
                progress: { value: 0.0 },
                transitionType: { value: 0.0 }, // 0: fade, 1: slide, 2: zoom, 3: wipe
                resolution: { value: new THREE.Vector2(size.width, size.height) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D fromTexture;
                uniform sampler2D toTexture;
                uniform float progress;
                uniform float transitionType;
                uniform vec2 resolution;
                varying vec2 vUv;
                
                void main() {
                    vec2 uv = vUv;
                    vec4 fromColor = texture2D(fromTexture, uv);
                    vec4 toColor = texture2D(toTexture, uv);
                    
                    if (transitionType < 0.5) {
                        // Fade transition
                        gl_FragColor = mix(fromColor, toColor, progress);
                    } else if (transitionType < 1.5) {
                        // Slide transition (left to right)
                        float slideOffset = progress * 2.0 - 1.0;
                        vec2 slideUv = uv + vec2(slideOffset, 0.0);
                        vec4 slideColor = texture2D(toTexture, slideUv);
                        gl_FragColor = mix(fromColor, slideColor, smoothstep(0.0, 1.0, progress));
                    } else if (transitionType < 2.5) {
                        // Zoom transition
                        float zoom = 1.0 + progress * 0.3;
                        vec2 zoomUv = (uv - 0.5) * zoom + 0.5;
                        vec4 zoomColor = texture2D(toTexture, zoomUv);
                        gl_FragColor = mix(fromColor, zoomColor, smoothstep(0.0, 1.0, progress));
                    } else {
                        // Wipe transition (top to bottom)
                        float wipeThreshold = progress;
                        if (uv.y > wipeThreshold) {
                            gl_FragColor = fromColor;
                        } else {
                            gl_FragColor = toColor;
                        }
                    }
                }
            `,
            transparent: true
        })
        
        return { geometry, material }
    }, [size])
    
    // Handle scene changes
    useEffect(() => {
        if (transitionState.current.fromScene !== currentScene) {
            transitionState.current.fromScene = transitionState.current.toScene || currentScene
            transitionState.current.toScene = currentScene
            transitionState.current.isTransitioning = true
            transitionState.current.progress = 0
            transitionState.current.startTime = performance.now() / 1000
            
            // Choose transition type based on scene
            const transitionTypes = ['fade', 'slide', 'zoom', 'wipe']
            const typeIndex = Math.floor(Math.random() * transitionTypes.length)
            transitionState.current.transitionType = transitionTypes[typeIndex]
            
            // Update shader uniforms
            if (fullscreenQuad.material.uniforms) {
                fullscreenQuad.material.uniforms.fromTexture.value = renderTargets[transitionState.current.fromScene]?.texture
                fullscreenQuad.material.uniforms.toTexture.value = renderTargets[currentScene]?.texture
                fullscreenQuad.material.uniforms.transitionType.value = typeIndex
                fullscreenQuad.material.uniforms.resolution.value.set(size.width, size.height)
            }
            
            console.log(`Transitioning from ${transitionState.current.fromScene} to ${currentScene} using ${transitionState.current.transitionType}`)
        }
    }, [currentScene, renderTargets, fullscreenQuad.material.uniforms, size])
    
    // Render current scene to its target
    useFrame(() => {
        if (renderTargets[currentScene]) {
            // Store current render target
            const currentTarget = gl.getRenderTarget()
            
            // Render the scene to the target
            gl.setRenderTarget(renderTargets[currentScene])
            gl.render(scene, camera)
            
            // Restore original render target
            gl.setRenderTarget(currentTarget)
        }
    })
    
    // Update transition progress
    useFrame((state) => {
        if (transitionState.current.isTransitioning) {
            const elapsed = (performance.now() / 1000) - transitionState.current.startTime
            transitionState.current.progress = Math.min(elapsed / transitionState.current.duration, 1)
            
            // Update shader progress uniform
            if (fullscreenQuad.material.uniforms) {
                fullscreenQuad.material.uniforms.progress.value = transitionState.current.progress
            }
            
            // Check if transition is complete
            if (transitionState.current.progress >= 1) {
                transitionState.current.isTransitioning = false
                transitionState.current.fromScene = currentScene
                transitionState.current.progress = 0
                console.log('Transition complete')
            }
        }
    })
    
    // Cleanup render targets
    useEffect(() => {
        return () => {
            Object.values(renderTargets).forEach(target => {
                target.dispose()
            })
        }
    }, [renderTargets])
    
    return (
        <>
            {/* Render the current scene normally */}
            {children}
            
            {/* Display the render target transition overlay */}
            {transitionState.current.isTransitioning && (
                <mesh geometry={fullscreenQuad.geometry} material={fullscreenQuad.material} />
            )}
        </>
    )
}
