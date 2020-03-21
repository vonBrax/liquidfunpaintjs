// Simple fragment shader with no textures

precision lowp float;
varying vec4 vColor; // Input color from vertex shader

void main() {
    gl_FragColor = vColor;
}
