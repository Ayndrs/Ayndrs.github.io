import { useEffect } from 'react'
import { useProgress } from '@react-three/drei'
import { gsap } from 'gsap'

import '../styles/cursor.css'

export default function Cursor() {
    const { active } = useProgress()

    useEffect(() => {
        if ('ontouchstart' in window) return

        const cursor = document.getElementById('cursor')
        const pos = { x: 0, y: 0 }
        const vel = { x: 0, y: 0 }
        let targetPos = { x: 0, y: 0 }
        let isHoveringClickable = false

        const setX = gsap.quickSetter(cursor, 'x', 'px')
        const setY = gsap.quickSetter(cursor, 'y', 'px')
        const setRotation = gsap.quickSetter(cursor, 'rotate', 'deg')
        const setScaleX = gsap.quickSetter(cursor, 'scaleX')
        const setScaleY = gsap.quickSetter(cursor, 'scaleY')
        const setOpacity = gsap.quickSetter(cursor, 'opacity')

        function getScale(dx, dy) {
        const distance = Math.sqrt(dx * dx + dy * dy)
        return Math.min(distance / 50, 0.45)
        }

        function getAngle(dx, dy) {
        return (Math.atan2(dy, dx) * 180) / Math.PI
        }

        function update() {
        const rotation = getAngle(vel.x, vel.y)
        const scale = getScale(vel.x, vel.y)

        setX(pos.x)
        setY(pos.y)
        setRotation(rotation)

        if (!isHoveringClickable) {
            setScaleX(1 + scale)
            setScaleY(1 - scale)
        }
        }

        function animate() {
        const speed = 0.35
        pos.x += (targetPos.x - pos.x) * speed
        pos.y += (targetPos.y - pos.y) * speed
        vel.x = targetPos.x - pos.x
        vel.y = targetPos.y - pos.y

        update()
        requestAnimationFrame(animate)
        }

        function handleCursorHover(isHovering) {
        isHoveringClickable = isHovering
        gsap.to(cursor, {
            scale: isHovering ? 1.5 : 1,
            duration: 0.3,
            ease: 'power2.out',
        })
        }

        function hideCursor() {
        gsap.to(cursor, {
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
        })
        }

        function showCursor() {
        gsap.to(cursor, {
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
        })
        }

        window.addEventListener('mousemove', (e) => {
        targetPos.x = e.clientX
        targetPos.y = e.clientY
        update()
        })

        document.querySelectorAll('a, button, [role=button], [type=button]')
        .forEach((el) => {
            el.addEventListener('mouseenter', () => handleCursorHover(true))
            el.addEventListener('mouseleave', () => handleCursorHover(false))
        })

        document.addEventListener('mouseleave', hideCursor)
        document.addEventListener('mouseenter', showCursor)

        document.querySelectorAll('iframe').forEach((iframe) => {
        iframe.addEventListener('mouseenter', hideCursor)
        iframe.addEventListener('mouseleave', showCursor)
        })

        animate()
    }, [])

    return <div id="cursor" />
}
