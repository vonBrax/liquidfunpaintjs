// Simple vertex shader with no textures

attribute vec4 aPosition; // in 2d worldspace
attribute vec4 aColor;    // vertex color
uniform mat4 uTransform;  // transforms from worldspace to clip space
varying vec4 vColor;    // output color for fragment shader

void main() {
    gl_Position = uTransform * aPosition;
    vColor = aColor;
}
