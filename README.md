# Dukefy
Simplex noise exploration with WebGL.

# DEMO
https://phcs93.github.io/genesis/

# TO-DO
* resize canvas when window is resizes
* add a seed parameter to the PRNG algorithm
* remove shader code from index.html
* remove "gl-matrix.js" depedency
* vertex gradient colors
  * fragment shader color enhancement 
* render multiple objects
* add lightning (star)
  * normal maps? (probably not necessary since there are no textures in the scene)
* render ocean as a separate geometry
  * add alpha channel for transparency
  * animate the ocean with 4D noise
* render clouds as separate geometry
  * add alpha channel for transparency
  * animate clouds with inverse 4D noise
* render gas giants (only clouds?)
* render liquid giants (only ocean?)
* add UI controls (mobile first?)
* add mouse control do rotate the planet
* add background (procedural?)
* add more noise algorithms
  * generators
  * selectors
  * modifiers
* *randomize all parameters on startup*
* import/export current seed, parameters and modules
* animated 2D visualizer

## EXTRA
* generate procedural audio

## OUT OF SCOPE (for now)
* render a solar system
  * one or more stars
  * one or more planets
  * one or more moons
* render celestial bodies (black holes, quazars, nebulas, etc.)
* render a galaxy
* render a universe
