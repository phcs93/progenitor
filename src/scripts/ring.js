function Ring (gl, seed, vertex, fragment) {

    const s = 100.0;

    const positions = [
        -s, -s, +s, +s, -s, +s,
        +s, +s, +s, -s, +s, +s,
        -s, -s, -s, -s, +s, -s,
        +s, +s, -s, +s, -s, -s,
        -s, +s, -s, -s, +s, +s,
        +s, +s, +s, +s, +s, -s,
        -s, -s, -s, +s, -s, -s,
        +s, -s, +s, -s, -s, +s,
        +s, -s, -s, +s, +s, -s,
        +s, +s, +s, +s, -s, +s,
        -s, -s, -s, -s, -s, +s,
        -s, +s, +s, -s, +s, -s
    ];

    const indexes = [
        00, 01, 02, 00, 02, 03,
        04, 05, 06, 04, 06, 07,
        08, 09, 10, 08, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ];

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);
    const program = createProgram(gl, vertexShader, fragmentShader);

    this.position = {x:0,y:0,z:0};
    this.angle = {x:0,y:0,z:0};

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indexes), gl.STATIC_DRAW);

    const timeLocation = gl.getUniformLocation(program, "time");
    const seedLocation = gl.getUniformLocation(program, "seed");

    const positionLocation = gl.getAttribLocation(program, "position");
    const viewLocation = gl.getUniformLocation(program, "view");
    const projectionLocation = gl.getUniformLocation(program, "projection");
    const normalLocation = gl.getUniformLocation(program, "normal");

    this.render = time => {
        
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

        gl.uniform1f(timeLocation, time);
        gl.uniform1f(seedLocation, seed);

        gl.drawElements(gl.TRIANGLES, indexes.length, gl.UNSIGNED_INT, 0);

    };

}