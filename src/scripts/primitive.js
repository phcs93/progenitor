class Primitive {

    constructor (gl, vertexShaderSource, fragmentShaderSource, alpha, seed) {

        this.vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        this.fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        this.program = createProgram(gl, vertexShader, fragmentShader);

        this.permutaion = createPermutationTable(seed);
        this.simplex = createSimplexVectors();
        this.tesseract = createTesseractVectors();

        this.breakpoints = createBreakpoints(seed);
        this.gradient = createGradient(breakpoints, 1024);

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indexes), gl.STATIC_DRAW);

        this.alphaCallback = alpha ? () => gl.enable(gl.BLEND) : () => gl.disable(gl.BLEND);

        this.positionLocation = gl.getAttribLocation(program, "position");

        this.timeLocation = gl.getUniformLocation(program, "time");
        this.seedLocation = gl.getUniformLocation(program, "seed");
        this.mouseLocation = gl.getUniformLocation(program, "mouse");        
        this.viewLocation = gl.getUniformLocation(program, "view");
        this.projectionLocation = gl.getUniformLocation(program, "projection");
        this.normalLocation = gl.getUniformLocation(program, "normal");    
        this.ambientLightColorLocation = gl.getUniformLocation(program, "ambientLightColor");
        this.directionalLightColorLocation = gl.getUniformLocation(program, "directionalLightColor");
        this.directionalLightDirectionLocation = gl.getUniformLocation(program, "directionalLightDirection");
        this.permutationLocation = gl.getUniformLocation(program, "permutation");
        this.simplexLocation = gl.getUniformLocation(program, "simplex");
        this.tesseractLocation = gl.getUniformLocation(program, "tesseract");
        this.gradientLocation = gl.getUniformLocation(program, "gradient");

        this.position = {x:0,y:0,z:-6};
        this.angle = {x:0,y:0,z:0};

        this.gl = gl;

    }

    render (time, mouse, lightining, mode = gl.TRIANGLES) {
        
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

        gl.uniform2f(mouseLocation, mouse[0], mouse[1]);

        gl.uniform3f(ambientLightColorLocation, lightining.ambientLightColor.r, lightining.ambientLightColor.g, lightining.ambientLightColor.b);
        gl.uniform3f(directionalLightColorLocation, lightining.directionalLightColor.r, lightining.directionalLightColor.g, lightining.directionalLightColor.b);
        gl.uniform3f(directionalLightDirectionLocation, lightining.directionalLightDirection.x, lightining.directionalLightDirection.y, lightining.directionalLightDirection.z);
        
        gl.drawElements(mode, indexes.length, gl.UNSIGNED_INT, 0);

    };

    static createShader (gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, concatCommonShaders(source).join(""));
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) return shader;   
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
    
    static createProgram (gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) return program;
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    static concatCommonShaders = source => [
        "#version 300 es\r\n",
        "precision highp float;\r\n",
        uniformsSource,
        randomSource,
        noiseSource,
        fbmSource,
        turbulenceSource,
        source
    ];

    static createPermutationTable (seed) {

        var LCG = s => () => (2**31-1&(s=Math.imul(48271,s)))/2**31;
        var random = LCG(seed * Number.MAX_SAFE_INTEGER);
    
        let array = [];
    
        for (let i = 0; i < 256; i++) {
            array.push(i);
        }
    
        array = array.sort(() => random() > 0.5 ? -1 : 1);
    
        return array.concat(array);
    
    }
    
    static createSimplexVectors () {
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
    
    static createTesseractVectors () {
        return [
            +0.0,+1.0,+1.0,+1.0,+0.0,+1.0,+1.0,-1.0,+0.0,+1.0,-1.0,+1.0,+0.0,+1.0,-1.0,-1.0,
            +0.0,-1.0,+1.0,+1.0,+0.0,-1.0,+1.0,-1.0,+0.0,-1.0,-1.0,+1.0,+0.0,-1.0,-1.0,-1.0,
            +1.0,+0.0,+1.0,+1.0,+1.0,+0.0,+1.0,-1.0,+1.0,+0.0,-1.0,+1.0,+1.0,+0.0,-1.0,-1.0,
            -1.0,+0.0,+1.0,+1.0,-1.0,+0.0,+1.0,-1.0,-1.0,+0.0,-1.0,+1.0,-1.0,+0.0,-1.0,-1.0,
            +1.0,+1.0,+0.0,+1.0,+1.0,+1.0,+0.0,-1.0,+1.0,-1.0,+0.0,+1.0,+1.0,-1.0,+0.0,-1.0,
            -1.0,+1.0,+0.0,+1.0,-1.0,+1.0,+0.0,-1.0,-1.0,-1.0,+0.0,+1.0,-1.0,-1.0,+0.0,-1.0,
            +1.0,+1.0,+1.0,+0.0,+1.0,+1.0,-1.0,+0.0,+1.0,-1.0,+1.0,+0.0,+1.0,-1.0,-1.0,+0.0,
            -1.0,+1.0,+1.0,+0.0,-1.0,+1.0,-1.0,+0.0,-1.0,-1.0,+1.0,+0.0,-1.0,-1.0,-1.0,+0.0	
        ];
    }

    static createBreakpoints (seed) {

        const LCG = s => () => (2**31-1&(s=Math.imul(48271,s)))/2**31;    
        const random = LCG(seed * Number.MAX_SAFE_INTEGER);
    
        const size = ~~(random() * 30) + 2;
        const gradient = [];
    
        for (let i = 0; i < size; i++) {
            gradient.push({
                value: random(),
                color: [random(),random(),random(),1.0]
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
    
    static createGradient (breakpoints, resolution) {
    
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

}