const gradientSource = `

    vec4 colors[7] = vec4[7](
        vec4(0.018,0.024,0.057,1.0), // 513928
        vec4(0.318,0.224,0.157,1.0), // 513928
        vec4(1.,1.,0.957,1.0), // FFFFF4
        vec4(0.314,0.718,0.153,1.0), // 50B727
        vec4(0.082,0.247,0.012,1.0), // 153F03
        vec4(0.318,0.224,0.157,1.0), // 513928
        vec4(0.937,0.937,0.933,1.0) // EFEFEE
    );

    float breakpoints[7] = float[7](
        0.0,
        0.45,
        0.5,
        0.6,
        0.7,
        0.9,
        1.0
    );

    // vec4 colors[2] = vec4[2](
    //     vec4(vec3(0.0),1.0),
    //     vec4(vec3(1.0),1.0)
    // );

    // float breakpoints[2] = float[2](
    //     0.0,
    //     1.0
    // );

    int[2] index (float breakpoint) {
        for (int i = 0; i < breakpoints.length()-1; i++) {
            if (breakpoint >= breakpoints[i] && breakpoint < breakpoints[i+1]) return int[2](i, i+1);
        }
        return int[2](breakpoints.length()-2, breakpoints.length()-1);
    }

    vec4 gradient (float v) {

        int[2] i = index(v);
        
        int i1 = i[0];
        int i2 = i[1];
        
        float v1 = breakpoints[i1];
        float v2 = breakpoints[i2];
        
        vec4 c1 = colors[i1];
        vec4 c2 = colors[i2];
        
        float v3 = smoothstep(v1, v2, v);
        vec4 color = mix(c1, c2, v3);
        
        return color;

    }

`;