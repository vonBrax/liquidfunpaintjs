// Blur fragment shader with a 5x5 gaussian blur.

// Changed precision from mediump to highp due to:
// Precisions of uniform 'uBlurBufferSize' differ between VERTEX and FRAGMENT shaders.
precision highp float;
uniform sampler2D uBlurTexture; // texture to blur
uniform float uBlurBufferSize;  // 1 / Size of the blur buffer
varying vec2 vTexCoord;         // input original texture coords for fragment
                                // shader. [0,1]
varying vec2 vBlurTexCoords[5]; // input texture coords for blur sampling, for
                                // fragment shader.

void main()
{
    vec4 sum = vec4(0.0);
    // Gaussian blur. Sigma: 2.3, kernel size: 5.
    sum += texture2D(uBlurTexture, vBlurTexCoords[0]) * 0.164074;
    sum += texture2D(uBlurTexture, vBlurTexCoords[1]) * 0.216901;
    sum += texture2D(uBlurTexture, vBlurTexCoords[2]) * 0.23805;
    sum += texture2D(uBlurTexture, vBlurTexCoords[3]) * 0.216901;
    sum += texture2D(uBlurTexture, vBlurTexCoords[4]) * 0.164074;
    gl_FragColor = sum;
}
