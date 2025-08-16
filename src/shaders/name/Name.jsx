import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

import vertexShader from './text.vert?raw'
import fragmentShader from './text.frag?raw'

export const Name = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0xffffff),
  },
  vertexShader,
  fragmentShader
)
