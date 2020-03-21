// Particle framebuffer to screen shader.

precision lowp float;
uniform sampler2D uDiffuseTexture; // frame buffer (with water particles)
uniform float uAlphaThreshold;     // Alpha threshold for the output
varying vec2 vTexCoord;            // input original texture coords from vertex
                                   // shader. [0,1]
varying vec2 vScrollingTexCoord;   // input scrolling texture coords from
                                   // vertex shader. [0,1]

void main()
{
    gl_FragColor = texture2D(uDiffuseTexture, vTexCoord);

    // Alpha Threshold
    gl_FragColor.a = (gl_FragColor.a > uAlphaThreshold) ? gl_FragColor.a : 0.0;
}
