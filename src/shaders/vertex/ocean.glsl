const oceanVertexShaderSource = `

    uniform mat4 view;
    uniform mat4 normal;
    uniform mat4 projection;

    in vec4 position;
    out vec4 color;
    out vec3 lighting;           

    void main() {

        vec4 d = vec4(0.0);
        float v = turbulence(vec4(position.xyz*50.0, time), d, 6);
        v = v / 0.5 - 0.5;

        // color = vec4(0.278, 0.49, 0.99, 0.5);
        // gl_Position = projection * view * vec4(position.xyz * (1.75), position.w);
        vec4 c = texture(gradient, vec2(seed, 0.0));
        color = vec4(c.rgb, 0.50 + (v/2.0));
        gl_Position = projection * view * vec4(position.xyz * (1.6 + seed/4.0), position.w);

        d -= 0.5;
        vec3 normalized = normalize(position.xyz - d.xyz);
        vec4 transformedNormal = normal * vec4(normalized, 1.0);
        float directional = max(dot(transformedNormal.xyz, directionalLightDirection), 0.0);
        lighting = ambientLightColor + (directionalLightColor * directional);

    }

`;