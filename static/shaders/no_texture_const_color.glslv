// Simple vertex shader with const color

attribute vec4 aPosition; // in 2d worldspace
uniform mat4 uTransform;  // transforms from worldspace to clip space
uniform vec4 uColor;      // constant vertex color
varying vec4 vColor;    // output color for fragment shader

void main() {
    gl_Position = uTransform * aPosition;
    vColor = uColor;
}
