// Simple vertex shader with texture coords

attribute vec4 aPosition;   // in 2d worldspace
attribute vec2 aTexCoord;   // texture coordinates for vertex
uniform mat4 uMvpTransform; // transforms from worldspace to clip space
uniform mat4 uUvTransform;  // transforms texture coords; allows uv scrolling etc
varying vec2 vTexCoord;          // output original texture coords for fragment
                                 // shader. [0,1]
varying vec2 vScrollingTexCoord; // output scrolling texture coords for
                                 // fragment shader. [0,1]

void main() {
    gl_Position = uMvpTransform * aPosition;
    // multiply texture coordinates with uvTransform and extract only xy
    vTexCoord = aTexCoord;
    vScrollingTexCoord = (uUvTransform * vec4(aTexCoord, 0, 1)).xy;
}
