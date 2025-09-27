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
