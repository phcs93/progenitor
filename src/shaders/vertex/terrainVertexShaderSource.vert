const terrainVertexShaderSource = `#version 300 es

    precision highp float;

    uint hash (uint v) {
        v += (v << 10u);
        v ^= (v >>  6u);
        v += (v <<  3u);
        v ^= (v >> 11u);
        v += (v << 15u);
        return v;
    }

    uint hash (uvec2 v) { return hash(v.x^hash(v.y)); }
    uint hash (uvec3 v) { return hash(v.x^hash(v.y)^hash(v.z)); }
    uint hash (uvec4 v) { return hash(v.x^hash(v.y)^hash(v.z)^hash(v.w)); }

    float floatConstruct (uint v) {
        v &= 0x007FFFFFu; // ieee mantissa
        v |= 0x3F800000u; // ieee one
        return uintBitsToFloat(v)-1.0;
    }

    float random (float v) { return floatConstruct(hash(floatBitsToUint(v))); }
    //float random (vec2 v) { return floatConstruct(hash(floatBitsToUint(v))); }
    //float random (vec3 v) { return floatConstruct(hash(floatBitsToUint(v))); }

    vec3 random (vec3 v){
        v = vec3(random(v.x),random(v.y),random(v.z));
        const vec3 k = vec3(3.1415926,2.71828,6.62607015);
        v = v*k+v.yzx;
        return -1.0+2.0*fract(2.0*k*fract(v.x*v.y*v.z*(v.x+v.y+v.z)));
    }

    const float F3 = 0.3333333;
    const float G3 = 0.1666667;

    float simplex (vec3 v) {    

        vec3 s = floor(v+dot(v,vec3(F3)));
        vec3 p = v-s+dot(s,vec3(G3));
        vec3 e = step(vec3(0.0),p-p.yzx);    
        vec3 i1 = e*(1.0-e.zxy);
        vec3 i2 = 1.0-e.zxy*(1.0-e);
        vec3 p1 = p-i1+G3;
        vec3 p2 = p-i2+2.0*G3;
        vec3 p3 = p-1.0+3.0*G3;    
        vec4 w = vec4(dot(p,p),dot(p1,p1),dot(p2,p2),dot(p3,p3));    
        vec4 d = vec4(dot(random(s),p),dot(random(s+i1),p1),dot(random(s+i2),p2),dot(random(s+1.0),p3));
        
        w = max(0.6-w,0.0);
        
        w *= w;
        w *= w;
        d *= w;

        return dot(d,vec4(52.0))*0.375+0.5;
        
    }

    float fbm (vec3 v, int octaves) {

        float factor = 0.0;
        float signal = 0.0;
        float scale = 0.5;

        for (int i = 0; i < octaves; i++){
            signal += simplex(v) * scale;
            factor += scale;
            v *= 2.0;
            scale *= 0.5;
        }
        
        return signal / factor;
        
    }

    //===
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
    //===

    uniform float time;

    uniform mat4 view;
    uniform mat4 projection;

    in vec4 position;
    out vec4 color;            

    void main() {
        float v = fbm(position.xyz, 8);
        color = gradient(v);
        v = (v/2.0)+1.5;
        gl_Position = projection * view * vec4(position.xyz * v, position.w);
    }

`;