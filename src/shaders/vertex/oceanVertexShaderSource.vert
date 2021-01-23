const oceanVertexShaderSource = `#version 300 es

    precision highp float;

    uniform float time;

    uniform mat4 view;
    uniform mat4 projection;

    in vec4 position;
    out vec4 color;            

    void main() {
        color = vec4(0.278,0.49,0.99,0.5);
        gl_Position = projection * view * vec4(position.xyz * 1.75, position.w);
    }

`;