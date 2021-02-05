# Genesis
Procedural planet generation with WebGL.

# DEMO
https://phcs93.github.io/genesis/

# TO-DO
* **generate gradient as a texture**
  * I have to try to use the built-in `texImage2D` to interpolate the gradient
* **improve parameter randomization**
* remove "gl-matrix.js" depedency
* matcap texture?
* add noise to ocean instead of single color
* render rivers (how?)
* render rings
* render gas giants (only clouds?)
* render liquid giants (only ocean?)
* add UI controls (mobile first?)
* add mouse control do rotate the planet
* add background (particles)
  * skybox with fragment shader particles
* add more noise algorithms
  * fbm wave modifiers
  * generators
  * selectors
  * modifiers
* import/export current seed, parameters and modules
* animated 2D visualizer
* post processing
  * bloom
  * blur
  * etc

## EXTRA
* generate procedural audio
* upload earth heightmap

## OUT OF SCOPE (for now)
* render a solar system
  * one or more stars
  * one or more planets
  * one or more moons
* render celestial bodies (black holes, quazars, nebulas, etc.)
* render a galaxy
* render a universe
