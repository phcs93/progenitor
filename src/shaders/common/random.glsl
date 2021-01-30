// const randomSource = `

//     uint hash (uint v) {
//         v += (v << 10u);
//         v ^= (v >>  6u);
//         v += (v <<  3u);
//         v ^= (v >> 11u);
//         v += (v << 15u);
//         return v;
//     }

//     uint hash (uvec2 v) { return hash(v.x^hash(v.y)); }
//     uint hash (uvec3 v) { return hash(v.x^hash(v.y)^hash(v.z)); }
//     uint hash (uvec4 v) { return hash(v.x^hash(v.y)^hash(v.z)^hash(v.w)); }

//     float floatConstruct (uint v) {
//         v &= 0x007FFFFFu; // ieee mantissa
//         v |= 0x3F800000u; // ieee one
//         return uintBitsToFloat(v)-1.0;
//     }

//     float random (float v) { return floatConstruct(hash(floatBitsToUint(v))); }
//     //float random (vec2 v) { return floatConstruct(hash(floatBitsToUint(v))); }
//     //float random (vec3 v) { return floatConstruct(hash(floatBitsToUint(v))); }

//     // vec3 random (vec3 v){
//     //     v = vec3(random(v.x),random(v.y),random(v.z));
//     //     const vec3 k = vec3(3.1415926,2.71828,6.62607015);
//     //     v = v*k+v.yzx;
//     //     return -1.0+2.0*fract(2.0*k*fract(v.x*v.y*v.z*(v.x+v.y+v.z)));
//     // }

// `;