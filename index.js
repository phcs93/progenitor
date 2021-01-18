document.addEventListener("DOMContentLoaded", () => {

    // webgl
    const vertexSource = document.querySelector("script[type='x-shader/x-vertex']").innerText;
    const fragmentSource = document.querySelector("script[type='x-shader/x-fragment']").innerText;
    const canvas = document.querySelector("canvas");
    const width = canvas.width = canvas.clientWidth;
    const height = canvas.height = canvas.clientHeight;
    const gl = canvas.getContext("webgl2");
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = createProgram(gl, vertexShader, fragmentShader); 
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);

    // sphere
    const {positions, indexes} = createSphere(1000);
    const positionAttributeLocation = gl.getAttribLocation(program, "aVertexPosition");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttributeLocation);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indexes), gl.STATIC_DRAW);
    const modelViewMatrixLocation = gl.getUniformLocation(program, "uModelViewMatrix");
    let angle = 0.0;

    // projection
    const projectionMatrixLocation = gl.getUniformLocation(program, "uProjectionMatrix");
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const render = () => {

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

        // render planet
        const modelViewMatrix = glMatrix.mat4.create();  
        glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);   
        glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, angle -= 0.01, [0, 1, 0]);
        gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);
        gl.drawElements(gl.TRIANGLES, indexes.length, gl.UNSIGNED_INT, 0);

        window.requestAnimationFrame(render);

    };

    render();

});

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

function createSphere (resolution) {    

    const latitudes = resolution % 2 === 0 ? resolution + 1 : resolution; // horizontal lines
    const longitudes = (latitudes * 2) + 1; // vertical lines

    const latitudeSpacing = 1 / (latitudes + 1);
    const longitudeSpacing = 1 / (longitudes);

    const positions = [];
    const indexes = [];

    const i = (lat, lon) => (lon%longitudes)+longitudes*(lat%latitudes);

    for (let latitude = 0; latitude < latitudes; latitude++) {
        for (let longitude = 0; longitude < longitudes; longitude++) {            

            const lx = longitude * longitudeSpacing;
            const ly = 1 - (latitude + 1) * latitudeSpacing;

            const lat = (ly - 0.5) * Math.PI;
            const lon = lx * 2.0 * Math.PI;

            const x = Math.cos(lat) * Math.cos(lon);
            const y = Math.sin(lat);
            const z = Math.cos(lat) * Math.sin(lon);

            positions.push(x,y,z);

            const v = i(latitude, longitude);
            const vb = i(latitude+1, longitude);
            const vr = i(latitude, longitude+1);
            const vbr = i(latitude+1, longitude+1);
            indexes.push(v, vb, vr, vr, vbr, vb); 

        }
    }    

    positions.push(0.0,+0.99,0.0);
    positions.push(0.0,-0.99,0.0);

    for (let lon = 0; lon < longitudes; lon++) {
        const latn = 0;
        const lats = latitudes-1;
        const n = (positions.length/3)-2;
        const s = (positions.length/3)-1;
        indexes.push(
            i(latn, lon), n, i(latn, lon+1),
            i(lats, lon), s, i(lats, lon+1),
        );
    }

    return {positions, indexes};

}