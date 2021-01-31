const turbulenceSource = `

    float turbulence (vec4 v, out vec4 derivatives, int octaves) {

        float dx = 0.0;
        float dy = 0.0;
        float dz = 0.0;
        float dw = 0.0;

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

        float xd = v.x + (noise(x0, y0, z0, w0, dx, dy, dz, dw) * 0.5 + 0.5);
        float yd = v.y + (noise(x1, y1, z1, w1, dx, dy, dz, dw) * 0.5 + 0.5);
        float zd = v.z + (noise(x2, y2, z2, w2, dx, dy, dz, dw) * 0.5 + 0.5);
        float wd = v.w + (noise(x3, y3, z3, w3, dx, dy, dz, dw) * 0.5 + 0.5);

        return fbm(vec4(xd, yd, zd, wd), derivatives, octaves);

    }

`;