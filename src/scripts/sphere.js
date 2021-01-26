function Sphere (resolution, gl, vertex, fragment, alpha = false) {

    const {positions, indexes} = createPositionsAndIndexes(resolution);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);
    const program = createProgram(gl, vertexShader, fragmentShader);

    this.x = 0;
    this.y = 0;
    this.z = -6;
    this.angle = {x:0,y:0,z:0};

    const alphaCallback = alpha ? () => gl.enable(gl.BLEND) : () => gl.disable(gl.BLEND);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indexes), gl.STATIC_DRAW);

    const timeLocation = gl.getUniformLocation(program, "time");
    const positionLocation = gl.getAttribLocation(program, "position");
    const viewLocation = gl.getUniformLocation(program, "view");  
    const normalLocation = gl.getUniformLocation(program, "normal");  
    const projectionLocation = gl.getUniformLocation(program, "projection");

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
        glMatrix.mat4.translate(viewMatrix, viewMatrix, [this.x, this.y, this.z]);   
        glMatrix.mat4.rotateX(viewMatrix, viewMatrix, this.angle.x);
        glMatrix.mat4.rotateY(viewMatrix, viewMatrix, this.angle.y);
        glMatrix.mat4.rotateZ(viewMatrix, viewMatrix, this.angle.z);
        gl.uniformMatrix4fv(viewLocation, false, viewMatrix);

        const normalMatrix = glMatrix.mat4.create();
        glMatrix.mat4.invert(normalMatrix, viewMatrix);
        glMatrix.mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(normalLocation, false, normalMatrix);

        const projectionMatrix = glMatrix.mat4.create();
        glMatrix.mat4.perspective(projectionMatrix, 45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
        gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);

        gl.uniform1f(timeLocation, time);
        
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
    noiseSource,
    fbmSource,
    turbulenceSource,
    gradientSource,
    source
];