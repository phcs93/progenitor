const fbmSource = `

    vec4 fbm (vec3 v, int octaves) {

        float factor = 0.0;
        float signal = 0.0;
        float scale = 0.5;
        vec3 derivative = vec3(0.0);

        for (int i = 0; i < octaves; i++){
            vec4 s = noise(v);
            signal += s.w * scale;
            derivative += s.xyz * scale;
            factor += scale;
            v *= 2.0;
            scale *= 0.5;
        }

        return vec4(derivative / factor, signal / factor);

    }

`;

/*
const fbmSource = `

    float fbm (vec3 v, int octaves) {

        float factor = 0.0;
        float signal = 0.0;
        float scale = 0.5;

        for (int i = 0; i < octaves; i++){
            signal += noise(v) * scale;
            factor += scale;
            v *= 2.0;
            scale *= 0.5;
        }
        
        return signal / factor;
        
    }

`;
*/