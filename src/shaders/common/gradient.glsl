const gradientSource = `

    uniform float[256] breakpoints;
    uniform vec4[256] colors;

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