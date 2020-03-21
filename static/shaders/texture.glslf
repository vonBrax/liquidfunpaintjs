// Simple fragment shader with one texture
// It only utilizes the scrolling texture coordinates right now.

precision lowp float;
uniform sampler2D uDiffuseTexture; // diffuse texture
uniform float uAlphaScale;         // scale to apply to alpha
varying vec2 vTexCoord;            // input original texture coords from vertex
                                   // shader. [0,1]
varying vec2 vScrollingTexCoord;   // input scrolling texture coords from
                                   // vertex shader. [0,1]

void main() {
    gl_FragColor = texture2D(uDiffuseTexture, vScrollingTexCoord);
    gl_FragColor.a *= uAlphaScale;
}
