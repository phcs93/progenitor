const backgroundVertexShaderSource = `

    uniform mat4 view;
    uniform mat4 normal;
    uniform mat4 projection;

    in vec4 position;

    void main() {
        gl_Position = projection * view * vec4(position.xyz, position.w);
    }
    
`;