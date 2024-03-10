# Progenitor
Procedural planet generation with WebGL.

# DEMO
https://phcs93.github.io/progenitor/

# BUGS
* derivative normals are not correct
  * i think it's a problem with the direction of the noise
* headless mode renders no light when using derivative normals

# TO-DO
* refactor noise.glsl to use vectors
* improve parameter randomization
* remove "gl-matrix.js" depedency
* matcap texture?
* render rivers (how?)
* render rings
* render gas giants (only clouds?)
* render liquid giants (only ocean?)
* add UI controls (mobile first?)
* add mouse control do rotate the planet
* add more noise algorithms
  * fbm wave modifiers
  * generators
  * selectors
  * modifiers
  * fortune's algorithm
* import/export current seed, parameters and modules
* animated 2D visualizer
* post processing
  * bloom
  * blur
  * etc

## EXTRA
* generate procedural audio
* upload custom parameters
  * heightmap
  * gradient

## OUT OF SCOPE (for now)
* render a solar system
  * one or more stars
  * one or more planets
  * one or more moons
* render celestial bodies (black holes, quazars, nebulas, etc.)
* render a galaxy
* render a universe
* simulate the ocean tide being affected by the gravity of the moon
