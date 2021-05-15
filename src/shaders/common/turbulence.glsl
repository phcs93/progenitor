const turbulenceSource = `

    float turbulence (vec4 v, out vec4 derivatives, int octaves, int distortion) {

        vec4 dx = vec4(0.0);
        vec4 dy = vec4(0.0);
        vec4 dz = vec4(0.0);
        vec4 dw = vec4(0.0);

        float x0 = v.x + (12414.0 / 65536.0);
        float y0 = v.y + (65124.0 / 65536.0);
        float z0 = v.z + (31337.0 / 65536.0);
        float w0 = v.w + (45891.0 / 65536.0);

        float x1 = v.x + (26519.0 / 65536.0);
        float y1 = v.y + (18128.0 / 65536.0);
        float z1 = v.z + (60493.0 / 65536.0);
        float w1 = v.w + (13657.0 / 65536.0);

        float x2 = v.x + (53820.0 / 65536.0);
        float y2 = v.y + (11213.0 / 65536.0);
        float z2 = v.z + (44845.0 / 65536.0);
        float w2 = v.w + (78987.0 / 65536.0);

        float x3 = v.x + (43543.0 / 65536.0);
        float y3 = v.y + (54766.0 / 65536.0);
        float z3 = v.z + (98712.0 / 65536.0);
        float w3 = v.w + (54886.0 / 65536.0);

        float xd = v.x + (fbm(vec4(x0, y0, z0, w0), dx, distortion));
        float yd = v.y + (fbm(vec4(x1, y1, z1, w1), dy, distortion));
        float zd = v.z + (fbm(vec4(x2, y2, z2, w2), dz, distortion));
        float wd = v.w + (fbm(vec4(x3, y3, z3, w3), dw, distortion));

        return fbm(vec4(xd, yd, zd, wd), derivatives, octaves);

    }

`;