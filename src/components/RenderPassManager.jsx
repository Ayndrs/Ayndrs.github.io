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
    const hasInitialized = useRef(false)
    
    // Create a full-screen quad for displaying render targets
    const fullscreenQuad = useMemo(() => {
        const geometry = new THREE.PlaneGeometry(2, 2)
        const material = new THREE.ShaderMaterial({
            uniforms: {
                fromTexture: { value: null },
                toTexture: { value: null },
                progress: { value: 0.0 },
                direction: { value: new THREE.Vector2(1.0, 0.0) },
                smoothness: { value: 0.35 },
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
                // Directional Warp Transition (Author: pschroen, License: MIT)
                uniform sampler2D fromTexture;
                uniform sampler2D toTexture;
                uniform float progress;
                uniform vec2 direction; // e.g., vec2(-1.0, 1.0)
                uniform float smoothness; // 0..1
                varying vec2 vUv;

                vec4 getFromColor(vec2 uv) { return texture2D(fromTexture, uv); }
                vec4 getToColor(vec2 uv) { return texture2D(toTexture, uv); }

                vec4 transition(vec2 uv) {
                  vec2 v = normalize(direction);
                  v /= abs(v.x) + abs(v.y);
                  const vec2 center = vec2(0.5, 0.5);
                  float d = v.x * center.x + v.y * center.y;
                  float m = 1.0 - smoothstep(-smoothness, 0.0, v.x * uv.x + v.y * uv.y - (d - 0.5 + progress * (1.0 + smoothness)));
                  return mix(
                    getFromColor((uv - 0.5) * (1.0 - m) + 0.5),
                    getToColor((uv - 0.5) * m + 0.5),
                    m
                  );
                }

                void main() {
                    gl_FragColor = transition(vUv);
                }
            `,
            transparent: true
        })
        
        return { geometry, material }
    }, [size])
    const fullscreenMeshRef = useRef()

    // Cache references to root scene groups by name
    const rootGroups = useRef({ home: null, projects: null, misc: null })
    useEffect(() => {
        rootGroups.current.home = scene.getObjectByName('home-root') || null
        rootGroups.current.projects = scene.getObjectByName('projects-root') || null
        rootGroups.current.misc = scene.getObjectByName('misc-root') || null
    }, [scene])

    // Background color per scene to avoid multiple <color attach="background"> conflicts
    const backgroundByScene = useRef({
        home: new THREE.Color('#0057b8'),
        projects: new THREE.Color('#ffffff'),
        misc: new THREE.Color('#2d1b69')
    })
    
    // Handle scene changes
    useEffect(() => {
        // On first mount, set initial state without triggering a transition
        if (!hasInitialized.current) {
            transitionState.current.fromScene = currentScene
            transitionState.current.toScene = currentScene
            transitionState.current.isTransitioning = false
            transitionState.current.progress = 0

            if (fullscreenQuad.material.uniforms) {
                fullscreenQuad.material.uniforms.fromTexture.value = renderTargets[currentScene]?.texture
                fullscreenQuad.material.uniforms.toTexture.value = renderTargets[currentScene]?.texture
                fullscreenQuad.material.uniforms.progress.value = 1.0
                fullscreenQuad.material.uniforms.resolution.value.set(size.width, size.height)
            }

            hasInitialized.current = true
            return
        }

        if (transitionState.current.fromScene !== currentScene) {
            transitionState.current.fromScene = transitionState.current.toScene || currentScene
            transitionState.current.toScene = currentScene
            transitionState.current.isTransitioning = true
            transitionState.current.progress = 0
            transitionState.current.startTime = performance.now() / 1000
            
            // Use a single transition (directional warp)
            transitionState.current.transitionType = 'directional-warp'
            
            // Update shader uniforms
            if (fullscreenQuad.material.uniforms) {
                fullscreenQuad.material.uniforms.fromTexture.value = renderTargets[transitionState.current.fromScene]?.texture
                fullscreenQuad.material.uniforms.toTexture.value = renderTargets[currentScene]?.texture
                fullscreenQuad.material.uniforms.resolution.value.set(size.width, size.height)
                // Set direction based on scene order: home(0), projects(1), misc(2)
                const order = { home: 0, projects: 1, misc: 2 }
                const fromIdx = order[transitionState.current.fromScene] ?? 0
                const toIdx = order[currentScene] ?? 0
                const dir = toIdx > fromIdx ? new THREE.Vector2(-1.0, 0.0) : new THREE.Vector2(1.0, 0.0)
                fullscreenQuad.material.uniforms.direction.value.copy(dir)
            }
            
            console.log(`Transitioning from ${transitionState.current.fromScene} to ${currentScene} using directional-warp`)
        }
    }, [currentScene, renderTargets, fullscreenQuad.material.uniforms, size])
    
    // Offscreen passes for transitions and keep targets updated
    useFrame(() => {
        const currentTargetBefore = gl.getRenderTarget()

        const setOnlyVisible = (key) => {
            const groups = rootGroups.current
            Object.keys(groups).forEach(name => {
                if (groups[name]) groups[name].visible = name === key
            })
        }

        const hideAllGroups = () => {
            const groups = rootGroups.current
            Object.keys(groups).forEach(name => {
                if (groups[name]) groups[name].visible = false
            })
        }

        // During transition: render "from" and "to" scenes into their targets
        if (transitionState.current.isTransitioning && transitionState.current.fromScene && transitionState.current.toScene) {
            // Ensure overlay is not drawn into offscreen passes
            if (fullscreenMeshRef.current) fullscreenMeshRef.current.visible = false

            // Render FROM
            if (renderTargets[transitionState.current.fromScene]) {
                setOnlyVisible(transitionState.current.fromScene)
                scene.background = backgroundByScene.current[transitionState.current.fromScene]
                gl.setRenderTarget(renderTargets[transitionState.current.fromScene])
                gl.clear()
                gl.render(scene, camera)
            }

            // Render TO
            if (renderTargets[transitionState.current.toScene]) {
                setOnlyVisible(transitionState.current.toScene)
                scene.background = backgroundByScene.current[transitionState.current.toScene]
                gl.setRenderTarget(renderTargets[transitionState.current.toScene])
                gl.clear()
                gl.render(scene, camera)
            }

            // Restore default framebuffer; let the overlay quad render only
            gl.setRenderTarget(currentTargetBefore)
            hideAllGroups()
            if (fullscreenMeshRef.current) fullscreenMeshRef.current.visible = true
        } else {
            // Not transitioning: keep current scene target updated and show only that scene
            if (renderTargets[currentScene]) {
                if (fullscreenMeshRef.current) fullscreenMeshRef.current.visible = false
                setOnlyVisible(currentScene)
                scene.background = backgroundByScene.current[currentScene]
                gl.setRenderTarget(renderTargets[currentScene])
                gl.clear()
                gl.render(scene, camera)
                gl.setRenderTarget(currentTargetBefore)
            }
        }
    })
    
    // Update transition progress
    useFrame((state) => {
        if (transitionState.current.isTransitioning) {
            const elapsed = (performance.now() / 1000) - transitionState.current.startTime
            transitionState.current.progress = Math.min(elapsed / transitionState.current.duration, 1)
            
            // Update shader progress uniform with easing (ease-out cubic: fast → slow)
            if (fullscreenQuad.material.uniforms) {
                const t = transitionState.current.progress
                const eased = 1.0 - Math.pow(1.0 - t, 3.0)
                fullscreenQuad.material.uniforms.progress.value = eased
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
            <mesh
                ref={fullscreenMeshRef}
                geometry={fullscreenQuad.geometry}
                material={fullscreenQuad.material}
                visible={false}
            />
        </>
    )
}
