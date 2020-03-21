// Blur vertex shader in the y- (v-) dimension, precomputing texcoords.

attribute vec4 aPosition;       // in 2d worldspace
attribute vec2 aTexCoord;       // texture coordinates for vertex
uniform float uBlurBufferSize;  // 1 / Size of the blur buffer
varying vec2 vTexCoord;         // output original texture coords for fragment
                                // shader. [0,1]
varying vec2 vBlurTexCoords[5]; // output texture coords for blur sampling, for
                                // fragment shader.

void main() {
    gl_Position = aPosition;
    vTexCoord = aTexCoord;
    // Pre-calculate the blur texcoords
    vBlurTexCoords[0] = vTexCoord + vec2(0.0, -2.0 * uBlurBufferSize);
    vBlurTexCoords[1] = vTexCoord + vec2(0.0, -1.0 * uBlurBufferSize);
    vBlurTexCoords[2] = vTexCoord;
    vBlurTexCoords[3] = vTexCoord + vec2(0.0,  1.0 * uBlurBufferSize);
    vBlurTexCoords[4] = vTexCoord + vec2(0.0,  2.0 * uBlurBufferSize);
}
