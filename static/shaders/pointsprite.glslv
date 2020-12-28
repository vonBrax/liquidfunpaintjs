// Point sprite vertex shader with varying point sizes

attribute vec4 aPosition;   // in 2d worldspace
attribute vec4 aColor;      // vertex color
attribute float aPointSize; // point size
uniform mat4 uTransform;    // transforms from worldspace to clip space
varying vec4 vColor;      // output color to fragment shader

void main() {
  gl_Position = uTransform * aPosition;
  gl_PointSize = aPointSize;
  vColor = aColor;
}
