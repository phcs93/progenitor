function Sphere (resolution, seed, gl, vertex, fragment, alpha = false) {

    const {positions, indexes} = createPositionsAndIndexes(resolution);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);
    const program = createProgram(gl, vertexShader, fragmentShader);

    this.position = {x:0,y:0,z:-6};
    this.angle = {x:0,y:0,z:0};

    this.ambientLightColor = {r: 0.025, g: 0.025, b: 0.025};
    this.directionalLightColor = {r: 1,  g: 1, b: 1};
    this.directionalLightVector = {x: 1.0, y: 0.0, z: 1.0};

    const permutaion = createPermutationTable(seed);
    const simplex = createSimplexVectors();
    const tesseract = createTesseractVectors();

    const breakpoints = createBreakpoints(seed);
    const gradient = createGradient(breakpoints, resolution);

    const alphaCallback = alpha ? () => gl.enable(gl.BLEND) : () => gl.disable(gl.BLEND);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indexes), gl.STATIC_DRAW);

    const timeLocation = gl.getUniformLocation(program, "time");
    const seedLocation = gl.getUniformLocation(program, "seed");

    const permutationLocation = gl.getUniformLocation(program, "permutation");
    const simplexLocation = gl.getUniformLocation(program, "simplex");
    const tesseractLocation = gl.getUniformLocation(program, "tesseract");
    const gradientLocation = gl.getUniformLocation(program, "gradient");

    const positionLocation = gl.getAttribLocation(program, "position");
    const viewLocation = gl.getUniformLocation(program, "view");
    const projectionLocation = gl.getUniformLocation(program, "projection");
    const normalLocation = gl.getUniformLocation(program, "normal");

    const ambientLightColorLocation = gl.getUniformLocation(program, "ambientLight");
    const directionalLightColorLocation = gl.getUniformLocation(program, "directionalLightColor");
    const directionalLightVectorLocation = gl.getUniformLocation(program, "directionalVector");

    this.render = time => {
        
        alphaCallback();
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.useProgram(program);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        const viewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.translate(viewMatrix, viewMatrix, [this.position.x, this.position.y, this.position.z]); 
        glMatrix.mat4.rotateX(viewMatrix, viewMatrix, this.angle.x);
        glMatrix.mat4.rotateY(viewMatrix, viewMatrix, this.angle.y);
        glMatrix.mat4.rotateZ(viewMatrix, viewMatrix, this.angle.z);
        gl.uniformMatrix4fv(viewLocation, false, viewMatrix);

        const projectionMatrix = glMatrix.mat4.create();
        glMatrix.mat4.perspective(projectionMatrix, 45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
        gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);

        const normalMatrix = glMatrix.mat4.create();
        glMatrix.mat4.invert(normalMatrix, viewMatrix);
        glMatrix.mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(normalLocation, false, normalMatrix);

        const permuationTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, permuationTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, permutaion.length, 1, 0, gl.ALPHA, gl.UNSIGNED_BYTE, new Uint8Array(permutaion));       

        const simplexTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, simplexTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, simplex.length / 4, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(simplex));       

        const terreractTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, terreractTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tesseract.length / 4, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(tesseract));       
        
        const gradientTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, gradientTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gradient.length / 4, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(gradient));

        gl.uniform1i(permutationLocation, 0);
        gl.uniform1i(simplexLocation, 1);
        gl.uniform1i(tesseractLocation, 2);
        gl.uniform1i(gradientLocation, 3);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, permuationTexture);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, simplexTexture);        
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, terreractTexture);
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, gradientTexture);

        gl.uniform1f(seedLocation, seed);
        gl.uniform1f(timeLocation, time);

        gl.uniform3f(ambientLightColorLocation, this.ambientLightColor.r, this.ambientLightColor.g, this.ambientLightColor.b);
        gl.uniform3f(directionalLightColorLocation, this.directionalLightColor.r, this.directionalLightColor.g, this.directionalLightColor.b);
        gl.uniform3f(directionalLightVectorLocation, this.directionalLightVector.x, this.directionalLightVector.y, this.directionalLightVector.z);
        
        gl.drawElements(gl.TRIANGLES, indexes.length, gl.UNSIGNED_INT, 0);

    };

}

function createPositionsAndIndexes (resolution) { // http://www.songho.ca/opengl/gl_sphere.html

    const stackCount = resolution % 2 === 0 ? resolution + 1 : resolution;
    const sectorCount = (stackCount * 2) + 1;

    const stackStep = Math.PI / stackCount;
    const sectorStep = 2 * Math.PI / sectorCount;
    
    const positions = [];
    const indexes = [];

    for (let i = 0; i <= stackCount; i++) {
        for(let j = 0; j <= sectorCount; j++) {
            const lat = Math.PI / 2 - i * stackStep;
            const lon = j * sectorStep;
            const x = Math.cos(lat) * Math.cos(lon);
            const y = Math.sin(lat);
            const z = Math.cos(lat) * Math.sin(lon);
            positions.push(x,y,z);
        }
    }

    for(let i = 0; i < stackCount; i++) {
        let k1 = i * (sectorCount + 1);
        let k2 = k1 + sectorCount + 1;
        for(let j = 0; j < sectorCount; j++, k1++, k2++) {
            if (i != 0) indexes.push(k1,k2,k1+1);
            if (i != (stackCount-1)) indexes.push(k1+1,k2,k2+1);
        }
    }

    return {positions, indexes};

}

function createPermutationTable (seed) {

    var LCG = s => () => (2**31-1&(s=Math.imul(48271,s)))/2**31;
    var lcg = LCG(seed * Number.MAX_SAFE_INTEGER);

    let array = [];

    for (let i = 0; i < 256; i++) {
        array.push(i);
    }

    array = array.sort(() => lcg() > 0.5 ? -1 : 1);

    return array.concat(array);

}

// function createSimplexVectors () {
//    return [
//         0,1,2,3,0,1,3,2,0,0,0,0,0,2,3,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,0,
// 		0,2,1,3,0,0,0,0,0,3,1,2,0,3,2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,3,2,0,
// 		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
// 		1,2,0,3,0,0,0,0,1,3,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,3,0,1,2,3,1,0,
// 		1,0,2,3,1,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,3,1,0,0,0,0,2,1,3,0,
// 		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
// 		2,0,1,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,1,2,3,0,2,1,0,0,0,0,3,1,2,0,
// 		2,1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,2,0,0,0,0,3,2,0,1,3,2,1,0
//     ];
// }

function createSimplexVectors () {
    return [
         00,10,20,30,00,10,30,20,00,00,00,00,00,20,30,10,00,00,00,00,00,00,00,00,00,00,00,00,10,20,30,00,
         00,20,10,30,00,00,00,00,00,30,10,20,00,30,20,10,00,00,00,00,00,00,00,00,00,00,00,00,10,30,20,00,
         00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
         10,20,00,30,00,00,00,00,10,30,00,20,00,00,00,00,00,00,00,00,00,00,00,00,20,30,00,10,20,30,10,00,
         10,00,20,30,10,00,30,20,00,00,00,00,00,00,00,00,00,00,00,00,20,00,30,10,00,00,00,00,20,10,30,00,
         00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
         20,00,10,30,00,00,00,00,00,00,00,00,00,00,00,00,30,00,10,20,30,00,20,10,00,00,00,00,30,10,20,00,
         20,10,00,30,00,00,00,00,00,00,00,00,00,00,00,00,30,10,00,20,00,00,00,00,30,20,00,10,30,20,10,00
     ];
 }

function createTesseractVectors () {
    return [
        0.0,1.0,1.0,1.0,0.0,1.0,1.0,-1.0,0.0,1.0,-1.0,1.0,0.0,1.0,-1.0,-1.0,
        0.0,-1.0,1.0,1.0,0.0,-1.0,1.0,-1.0,0.0,-1.0,-1.0,1.0,0.0,-1.0,-1.0,-1.0,
        1.0,0.0,1.0,1.0,1.0,0.0,1.0,-1.0,1.0,0.0,-1.0,1.0,1.0,0.0,-1.0,-1.0,
        -1.0,0.0,1.0,1.0,-1.0,0.0,1.0,-1.0,-1.0,0.0,-1.0,1.0,-1.0,0.0,-1.0,-1.0,
        1.0,1.0,0.0,1.0,1.0,1.0,0.0,-1.0,1.0,-1.0,0.0,1.0,1.0,-1.0,0.0,-1.0,
        -1.0,1.0,0.0,1.0,-1.0,1.0,0.0,-1.0,-1.0,-1.0,0.0,1.0,-1.0,-1.0,0.0,-1.0,
        1.0,1.0,1.0,0.0,1.0,1.0,-1.0,0.0,1.0,-1.0,1.0,0.0,1.0,-1.0,-1.0,0.0,
        -1.0,1.0,1.0,0.0,-1.0,1.0,-1.0,0.0,-1.0,-1.0,1.0,0.0,-1.0,-1.0,-1.0,0.0	
    ];
 }

function createBreakpoints (seed) {

    const LCG = s => () => (2**31-1&(s=Math.imul(48271,s)))/2**31;

    const lcg = LCG(seed * Number.MAX_SAFE_INTEGER);

    const size = ~~(lcg() * 30) + 2;
    const gradient = [];

    for (let i = 0; i < size; i++) {
        gradient.push({
            value: lcg(),
            color: [lcg(),lcg(),lcg(),1.0]
        });
    }

    gradient.sort((a,b) => a.value - b.value);

    gradient[0].value = 0.0;
    gradient[size-1].value = 1.0;

    return gradient;

    // return [ 
    //     {value: 0.000, color: [0.018, 0.024, 0.057, 1.000]},
    //     {value: 0.400, color: [0.318, 0.224, 0.157, 1.000]},
    //     {value: 0.500, color: [1.000, 1.000, 0.957, 1.000]},
    //     {value: 0.600, color: [0.314, 0.718, 0.153, 1.000]},
    //     {value: 0.700, color: [0.082, 0.247, 0.012, 1.000]},
    //     {value: 0.900, color: [0.318, 0.224, 0.157, 1.000]},
    //     {value: 1.000, color: [0.937, 0.937, 0.933, 1.000]}
    // ];

}

function createGradient (breakpoints, resolution) {

    const indexes = (v) => {
        for (let i = 0; i < breakpoints.length-1; i++) {
            if (v >= breakpoints[i].value && v < breakpoints[i+1].value) return [i, i+1];
        }
        return [breakpoints.length()-2, breakpoints.length()-1];
    }

    const gradient = [];

    for (let i = 0; i < resolution; i++) {

        const value = i / resolution;

        const [i1, i2] = indexes(value);

        const b1 = breakpoints[i1];
        const b2 = breakpoints[i2];

        const v = (value - b1.value) / (b2.value - b1.value);
        //const smoothstep = v*v*(3-2*v);
        const smoothstep = v*v*v*(v*(v*6-15)+10);
        const c = glMatrix.vec4.lerp([], b1.color, b2.color, smoothstep);

        const color = glMatrix.vec4.multiply([], c, [255,255,255,255]);

        gradient.push(...color.map(a => parseInt(a)));
        
    }

    return gradient;

}

function createShader (gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, concatCommonShaders(source).join(""));
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;   
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram (gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

const concatCommonShaders = source => [
    "#version 300 es\r\n",
    "precision highp float;\r\n",
    uniformsSource,
    randomSource,
    noiseSource,
    fbmSource,
    turbulenceSource,
    source
];