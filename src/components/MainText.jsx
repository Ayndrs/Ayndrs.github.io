import { Fluid } from '@whatisjery/react-fluid-distortion';
import { EffectComposer, DepthOfField, Bloom } from '@react-three/postprocessing';
import { Text } from '@react-three/drei'

export default function MainText() {
  return (
    <>
        <EffectComposer>
            <Fluid
                radius={0.03}
                curl={1}
                swirl={2}
                distortion={0.25}
                force={1}
                pressure={0.94}
                densityDissipation={0.98}
                velocityDissipation={0.99}
                intensity={0.5}
                rainbow={false}
                blend={0}
                showBackground={true}
                backgroundColor='#a7958b'
                fluidColor='#cfc0a8'
            />

            <DepthOfField
                focusDistance={0.015}   // Lower = closer focus plane
                focalLength={0.03}      // Higher = stronger blur
                bokehScale={2}          // Size of blur circle
            />
        </EffectComposer>

        <Text
            font="./fonts/KenokyLight.ttf"
            fontSize={1}
            color="white"
            anchorX="center"
            anchorY="middle"
            textAlign='center'
            maxWidth={2}
            position={[0, 0.25, 0]}
        >
            gohyun
        </Text>
        <Text
            font="./fonts/Poppins-Light.ttf"
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
            textAlign='center'
            maxWidth={2}
            position={[0, -0.5, 0]}
        >
            software developer
        </Text>
    </>
  )
}
