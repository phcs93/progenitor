const fbmSource = `

    float fbm (vec4 v, out vec4 derivative, int octaves) {

        float factor = 0.0;
        float signal = 0.0;
        float scale = 0.5;

        for (int i = 0; i < octaves; i++){
            float dx = 0.0;
            float dy = 0.0;
            float dz = 0.0;
            float dw = 0.0;
            float n = noise(v.x, v.y, v.z, v.w, dx, dy, dz, dw);
            signal += n * scale;
            vec4 d = vec4(dx, dy, dz, dw);        
            derivative += d * scale;
            factor += scale;
            v *= 2.0;
            scale *= 0.5;
        }

        derivative /= factor;

        return signal / factor;

    }

`;