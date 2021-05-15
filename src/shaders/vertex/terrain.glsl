const terrainVertexShaderSource = `

    uniform mat4 view;
    uniform mat4 normal;
    uniform mat4 projection;

    in vec4 position;
    out vec4 color;
    out vec3 lighting;

    vec3 qRotateVector(vec3 v, vec4 q) {
        vec3 t = 2.0 * cross(q.xyz, v);
        return v + q.w * t + cross(q.xyz, t);
    }

    vec4 qFromToRotation(vec3 v) {
        vec3 up = vec3(0.0, 1.0, 0.0);
        float d = dot(up, v);

        if (d < -0.999999) {
            return vec4(0.0, 0.0, 1.0, 0.0);
        }
        else if (d > 0.999999) {
            return vec4(0.0, 0.0, 0.0, 1.0);
        }
        else {
            return normalize(vec4(cross(up, v), d + 1.0));
        }
    }

    float noiseSlope(vec3 derivatives, vec3 normal) {
        vec4 noiseRotation = qFromToRotation(normal);
        vec3 derivativeNormal = qRotateVector(derivatives, vec4(-noiseRotation.xyz, noiseRotation.w));
        return abs(dot(normalize(vec3(-derivativeNormal.x, 1.0, -derivativeNormal.z)), vec3(0.0, 1.0, 0.0)));
    }

    void main() {

        vec4 d = vec4(0.0);
        //float v = fbm(vec4(position.xyz, 0.0), d, 6);
        float v = turbulence(vec4(position.xyz, 0.0), d, 1, 6);

        color = texture(gradient, vec2(v, 0.0));

        //v = v/0.5-0.5;
        v = (v/2.0)+1.5;
        gl_Position = projection * view * vec4(position.xyz * v, position.w);

        d -= 0.5;
        vec3 normalized = normalize(position.xyz - d.xyz);
        vec4 transformedNormal = normal * vec4(normalized, 0.0);
        float directional = max(dot(transformedNormal.xyz, directionalLightDirection), 0.0);
        lighting = ambientLightColor + (directionalLightColor * directional);

    }

`;