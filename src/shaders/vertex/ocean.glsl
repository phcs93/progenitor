const oceanVertexShaderSource = `

    uniform float time;

    uniform mat4 view;
    uniform mat4 normal;
    uniform mat4 projection;

    in vec4 position;
    out vec4 color;
    out vec3 lighting;           

    void main() {

        vec4 s = fbm((position.xyz+time/100.0)*50.0, 8);    
        float v = s.w;

        //color = vec4(0.278, 0.49, 0.99, 0.5);
        //gl_Position = projection * view * vec4(position.xyz * (1.75), position.w);
        color = vec4(gradient(seed).rgb, 0.4);
        gl_Position = projection * view * vec4(position.xyz * (1.6 + seed/4.0), position.w);

        vec3 normalized = vec3(normalize(position.xyz - (s.xyz * 0.45)));
        vec3 ambientLight = vec3(0.025, 0.025, 0.025);
        vec3 directionalLightColor = vec3(1, 1, 1);
        vec3 directionalVector = vec3(0.5, 0.0, 1.0);
        vec4 transformedNormal = normal * vec4(normalized, 1.0);
        float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        lighting = ambientLight + (directionalLightColor * directional);

    }

`;