// Vertex shader for particles

attribute vec4 aPosition; // in 2d worldspace
attribute vec4 aColor;    // vertex color
uniform mat4 uTransform;  // transforms from worldspace to clip space
uniform float uPointSize; // constant point size
varying vec4 vColor;    // output color for fragment shader

void main() {
  gl_Position = uTransform * aPosition;
  gl_PointSize = uPointSize;
  vColor = aColor;
}
