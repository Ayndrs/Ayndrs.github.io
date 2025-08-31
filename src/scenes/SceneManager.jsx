import { useScene } from '../contexts/SceneContext'
import HomeScene from './HomeScene.jsx'
import ProjectsScene from './ProjectsScene.jsx'
import MiscScene from './MiscScene.jsx'

export default function SceneManager() {
    const { currentScene } = useScene()

    switch (currentScene) {
        case 'home':
            return <HomeScene />
        case 'projects':
            return <ProjectsScene />
        case 'misc':
            return <MiscScene />
        default:
            return <HomeScene />
    }
}
