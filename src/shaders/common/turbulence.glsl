const turbulenceSource = `

    vec4 turbulence (vec3 v) {

        float x0 = v.x + (12414.0 / 65536.0);
        float y0 = v.y + (65124.0 / 65536.0);
        float z0 = v.z + (31337.0 / 65536.0);
        float x1 = v.x + (26519.0 / 65536.0);
        float y1 = v.y + (18128.0 / 65536.0);
        float z1 = v.z + (60493.0 / 65536.0);
        float x2 = v.x + (53820.0 / 65536.0);
        float y2 = v.y + (11213.0 / 65536.0);
        float z2 = v.z + (44845.0 / 65536.0);
        float xd = v.x + (noise(vec3(x0, y0, z0)).w * 1.0);
        float yd = v.y + (noise(vec3(x1, y1, z1)).w * 1.0);
        float zd = v.z + (noise(vec3(x2, y2, z2)).w * 1.0);

        return fbm(vec3(xd,yd,zd), 4);

    }

`;