const noiseSource = `

    uniform float seed;

    float sixth = 0.1666666666666667;
    float third = 0.3333333333333333;

    //vec4 permute (vec4 v) { return mod((v * 34.0 + 1.0) * v, 289.0); }
    vec4 permute (vec4 v) { return mod((v * 34.0 + 1.0) * v, 289.0 + seed); }
    vec4 taylor (vec4 v) { return 1.79284291400159 - v * 0.85373472095314; }

    vec4 noise (vec3 v) { // https://www.shadertoy.com/view/Ws23RD

        vec3 i  = floor(v + dot(v, vec3(third)));
        vec3 p1 = v - i + dot(i, vec3(sixth));

        vec3 g = step(p1.yzx, p1.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 p2 = p1 - i1 + sixth;
        vec3 p3 = p1 - i2 + third;
        vec3 p4 = p1 - 0.5;
        
        vec4 ix = i.x + vec4(0.0, i1.x, i2.x, 1.0);
        vec4 iy = i.y + vec4(0.0, i1.y, i2.y, 1.0);
        vec4 iz = i.z + vec4(0.0, i1.z, i2.z, 1.0);

        vec4 p = permute(permute(permute(iz)+iy)+ix);

        vec4 r = mod(p, 49.0);

        vec4 x_ = floor(r / 7.0);
        vec4 y_ = floor(r - 7.0 * x_); 

        vec4 x = (x_ * 2.0 + 0.5) / 7.0 - 1.0;
        vec4 y = (y_ * 2.0 + 0.5) / 7.0 - 1.0;

        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

        vec3 g1 = vec3(a0.xy, h.x);
        vec3 g2 = vec3(a0.zw, h.y);
        vec3 g3 = vec3(a1.xy, h.z);
        vec3 g4 = vec3(a1.zw, h.w);

        vec4 n = taylor(vec4(dot(g1,g1),dot(g2,g2),dot(g3,g3),dot(g4,g4)));    

        vec3 n1 = g1 * n.x;
        vec3 n2 = g2 * n.y;
        vec3 n3 = g3 * n.z;
        vec3 n4 = g4 * n.w;

        vec4 m = vec4(dot(p1,p1),dot(p2,p2),dot(p3,p3),dot(p4,p4));
        
        vec4 m1 = max(0.6 - m, 0.0);
        vec4 m2 = m1 * m1;
        vec4 m3 = m2 * m1;
        vec4 m4 = m2 * m2;
        
        vec3 q1 = -6.0 * m3.x * p1 * dot(p1, n1) + m4.x * n1;
        vec3 q2 = -6.0 * m3.y * p2 * dot(p2, n2) + m4.y * n2;
        vec3 q3 = -6.0 * m3.z * p3 * dot(p3, n3) + m4.z * n3;
        vec3 q4 = -6.0 * m3.w * p4 * dot(p4, n4) + m4.w * n4;
        
        vec3 q = q1+q2+q3+q4;
        
        vec4 t = vec4(dot(p1,n1),dot(p2,n2),dot(p3,n3),dot(p4,n4));
        
        return (64.0 * vec4(q, dot(m4, t))) * 0.5 + 0.5;
        
    }

`;

/*
const noiseSource = `

    const float F3 = 0.3333333;
    const float G3 = 0.1666667;

    float noise (vec3 v) {    

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

        return 0.5 + dot(d,vec4(52.0)) * 0.5;
        
    }

`;
*/