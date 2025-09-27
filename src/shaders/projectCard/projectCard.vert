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
