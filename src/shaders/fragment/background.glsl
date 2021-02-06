const backgroundFragmentShaderSource = `

    out vec4 fragmentColor;

    void main() {
        float v = random(gl_FragCoord+seed);        
        float c = pow(clamp(v-0.97, 0.0, 1.0)/(1.0-0.97),50.0);
        fragmentColor = vec4(vec3(c), 1.0);
    }
    
`;