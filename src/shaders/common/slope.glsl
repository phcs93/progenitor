// vec3 qRotateVector(vec3 v, vec4 q) {
//     vec3 t = 2.0 * cross(q.xyz, v);
//     return v + q.w * t + cross(q.xyz, t);
// }

// vec4 qFromToRotation(vec3 v) {
//     vec3 up = vec3(0.0, 1.0, 0.0);
//     float d = dot(up, v);

//     if (d < -0.999999) {
//         return vec4(0.0, 0.0, 1.0, 0.0);
//     }
//     else if (d > 0.999999) {
//         return vec4(0.0, 0.0, 0.0, 1.0);
//     }
//     else {
//         return normalize(vec4(cross(up, v), d + 1.0));
//     }
// }

// float noiseSlope(vec3 derivatives, vec3 normal) {
//     vec4 noiseRotation = qFromToRotation(normal);
//     vec3 derivativeNormal = qRotateVector(derivatives, vec4(-noiseRotation.xyz, noiseRotation.w));
//     return abs(dot(normalize(vec3(-derivativeNormal.x, 1.0, -derivativeNormal.z)), vec3(0.0, 1.0, 0.0)));
// }