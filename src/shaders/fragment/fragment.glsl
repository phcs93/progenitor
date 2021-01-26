const fragmentShaderSource = `

    in vec4 color;
    in vec3 lighting;
    out vec4 fragmentColor;   

    void main() {
        fragmentColor = vec4(color.rgb * lighting, color.a);
    }
    
`;