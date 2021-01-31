const terrainVertexShaderSource = `

    uniform float time;

    uniform mat4 view;
    uniform mat4 normal;
    uniform mat4 projection;

    in vec4 position;
    out vec4 color;
    out vec3 lighting;

    void main() {

        vec4 s = fbm(position.xyz, 8);        
        float v = s.w;
        color = gradient(v);
        v = (v/2.0)+1.5;
        gl_Position = projection * view * vec4(position.xyz * v, position.w); 

        vec3 normalized = vec3(normalize(position.xyz - (s.xyz * 0.45)));
        vec3 ambientLight = vec3(0.025, 0.025, 0.025);
        vec3 directionalLightColor = vec3(1, 1, 1);
        vec3 directionalVector = vec3(1.0, 0.0, 1.0);
        vec4 transformedNormal = normal * vec4(normalized, 1.0);
        float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        lighting = ambientLight + (directionalLightColor * directional);

    }

`;