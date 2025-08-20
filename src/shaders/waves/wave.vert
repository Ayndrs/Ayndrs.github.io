uniform float uTime;
varying vec2 vUv;

void main() {
    vUv = uv;

    vec3 pos = position;
    pos.z += sin(pos.x * 5.0 + uTime * 2.0) * 0.2; 
    pos.y += cos(pos.x * 3.0 + uTime * 1.5) * 0.1;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
