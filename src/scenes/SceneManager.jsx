import { useScene } from '../contexts/SceneContext'
import HomeScene from './HomeScene.jsx'
import ProjectsScene from './ProjectsScene.jsx'
import MiscScene from './MiscScene.jsx'

export default function SceneManager() {
    const { currentScene } = useScene()

    return (
        <>
            {/* Mount all scenes at once; visibility toggled via RenderPassManager during FBO passes */}
            <group name="home-root" visible={currentScene === 'home'}>
                <HomeScene />
            </group>
            <group name="projects-root" visible={currentScene === 'projects'}>
                <ProjectsScene />
            </group>
            <group name="misc-root" visible={currentScene === 'misc'}>
                <MiscScene />
            </group>
        </>
    )
}
