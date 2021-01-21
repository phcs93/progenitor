function Planet (resolution, gl, vertex, fragment) {

    const sphere = new Sphere(resolution);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);
    const program = createProgram(gl, vertexShader, fragmentShader);

    this.x = 0; // not implemented
    this.y = 0; // not implemented
    this.z = 0; // not implemented
    this.angle = {x:0,y:0,z:0};

    this.render = () => {
        
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere.positions), gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(sphere.indexes), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "position");
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);

        const viewLocation = gl.getUniformLocation(program, "view");  
        const viewMatrix = glMatrix.mat4.create();  
        glMatrix.mat4.translate(viewMatrix, viewMatrix, [-0.0, 0.0, -6.0]);   
        glMatrix.mat4.rotate(viewMatrix, viewMatrix, this.angle.x, [1,0,0]);
        glMatrix.mat4.rotate(viewMatrix, viewMatrix, this.angle.y, [0,1,0]);
        glMatrix.mat4.rotate(viewMatrix, viewMatrix, this.angle.z, [0,0,1]);
        gl.uniformMatrix4fv(viewLocation, false, viewMatrix);

        const projectionLocation = gl.getUniformLocation(program, "projection");
        const projectionMatrix = glMatrix.mat4.create();
        glMatrix.mat4.perspective(projectionMatrix, 45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
        gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);          

        gl.drawElements(gl.TRIANGLES, sphere.indexes.length, gl.UNSIGNED_INT, 0);

    };

}

function createShader (gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
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