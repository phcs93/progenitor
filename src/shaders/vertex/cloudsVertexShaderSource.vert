const cloudsVertexShaderSource = `#version 300 es

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

    float turbulence (vec3 v) {

        float x0 = v.x + (12414.0 / 65536.0);
        float y0 = v.y + (65124.0 / 65536.0);
        float z0 = v.z + (31337.0 / 65536.0);
        float x1 = v.x + (26519.0 / 65536.0);
        float y1 = v.y + (18128.0 / 65536.0);
        float z1 = v.z + (60493.0 / 65536.0);
        float x2 = v.x + (53820.0 / 65536.0);
        float y2 = v.y + (11213.0 / 65536.0);
        float z2 = v.z + (44845.0 / 65536.0);
        float xd = v.x + (simplex(vec3(x0, y0, z0)) * 1.0);
        float yd = v.y + (simplex(vec3(x1, y1, z1)) * 1.0);
        float zd = v.z + (simplex(vec3(x2, y2, z2)) * 1.0);

        return fbm(vec3(xd,yd,zd), 8);

    }

    uniform float time;

    uniform mat4 view;
    uniform mat4 projection;

    in vec4 position;
    out vec4 color;            

    void main() {
        float v = turbulence(position.xyz+time/12.0);
        color = vec4(1.0,1.0,1.0,v < 0.35 ? v+0.20 : v-0.60);
        gl_Position = projection * view * vec4(position.xyz * 2.0, position.w);
    }

`;