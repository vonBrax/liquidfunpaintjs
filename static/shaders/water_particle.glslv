// Vertex shader for particles

attribute vec4 aPosition; // in 2d worldspace
attribute vec4 aColor;    // vertex color
attribute float aWeight;  // particle weight
uniform mat4 uTransform;  // transforms from worldspace to clip space
uniform float uPointSize; // constant point size
uniform vec3 uWeightParams; // Parameters for adding in particle weight.
                            // 0: Scale - decreases the range of values
                            // 1: Range shift - shift the range from [0.0, inf)
                            //    to [value, inf) so we get a less abrupt
                            //    dropoff.
                            // 2: Cutoff - values above this will affect color
varying vec4 vColor;      // output color for fragment shader

void main() {
  gl_Position = uTransform * aPosition;
  gl_PointSize = uPointSize;
  vColor = aColor;

  // Square the weight to make a nicer curve, then apply scale and range shift.
  float weight = aWeight * aWeight * uWeightParams[0] + uWeightParams[1];

  // Modulate the color by weight, if the weight is above the cutoff.
  vColor.rgb *= (weight > uWeightParams[2]) ? 1.0 / weight : 1.0;
}
