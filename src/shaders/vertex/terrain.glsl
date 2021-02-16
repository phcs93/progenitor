const terrainVertexShaderSource = `

    uniform mat4 view;
    uniform mat4 normal;
    uniform mat4 projection;

    in vec4 position;
    out vec4 color;
    out vec3 lighting;

    void main() {

        vec4 d = vec4(0.0);
        float v = fbm(vec4(position.xyz, 0.0), d, 6);

        color = texture(gradient, vec2(v, 0.0));

        v = v/0.5-0.5;
        v = (v/2.0)+1.5;                
        gl_Position = projection * view * vec4(position.xyz * v, position.w);

        d -= 0.5;
        vec3 normalized = normalize(position.xyz - d.xyz);
        vec4 transformedNormal = normal * vec4(normalized, 1.0);
        float directional = max(dot(transformedNormal.xyz, directionalLightDirection), 0.0);
        lighting = ambientLightColor + (directionalLightColor * directional);

    }

`;