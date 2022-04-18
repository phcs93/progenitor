document.addEventListener("DOMContentLoaded", () => {

    const url = new URL(window.location.href);
    const bot = url.searchParams.get("bot");
    const seed = parseFloat(url.searchParams.get("seed")) || Math.random();

    const canvas = document.querySelector("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const mouse = [0.0, 0.0];
    let pressed = false;

    let movementX = 0;
    let movementY = 0;

    window.addEventListener("mousemove", e => {
        const mouseX = (e.offsetX / canvas.clientWidth) * 2 - 1;
        const mouseY = ((canvas.clientHeight - e.offsetY) / canvas.clientHeight) * 2 - 1;
        mouse[0] = mouseX;
        mouse[1] = mouseY;
        if (pressed) {
            movementY += e.movementX/512;
            movementX += e.movementY/512;
        }
    });

    window.addEventListener("mousedown", e => {
        pressed = true;
    });

    window.addEventListener("mouseup", e => {
        pressed = false;
    });    

    const gl = canvas.getContext("webgl2", {
        preserveDrawingBuffer: true,
        alpha: false,
        antialias: true,
        premultipliedAlpha: true
    });

    let renderMode = gl.TRIANGLES;

    document.getElementById("render-mode").onchange = function() {
        switch (this.value) {
            case "POINTS": renderMode = gl.POINTS; break;
            case "LINE_STRIP": renderMode = gl.LINE_STRIP; break;
            case "LINE_LOOP": renderMode = gl.LINE_LOOP; break;
            case "LINES": renderMode = gl.LINES; break;
            case "LINE_STRIP_ADJACENCY": renderMode = gl.LINE_STRIP_ADJACENCY; break;
            case "LINES_ADJACENCY": renderMode = gl.LINES_ADJACENCY; break;
            case "TRIANGLE_STRIP": renderMode = gl.TRIANGLE_STRIP; break;
            case "TRIANGLE_FAN": renderMode = gl.TRIANGLE_FAN; break;
            case "TRIANGLES": renderMode = gl.TRIANGLES; break;
            case "TRIANGLE_STRIP_ADJACENCY": renderMode = gl.TRIANGLE_STRIP_ADJACENCY; break;
            case "TRIANGLES_ADJACENCY": renderMode = gl.TRIANGLES_ADJACENCY; break;
            case "PATCHES": renderMode = gl.PATCHES; break;
        }
    };

    let time = 0.0;
    let last = (Date.now() / 1000);

    const resolution = bot ? 300 : 500;

    const lightining = {
        ambientLightColor: { r: 0.025, g: 0.025, b: 0.025 },
        directionalLightColor: { r: 1.0, g: 1.0, b: 1.0 },
        directionalLightDirection: { x: 1.0, y: 0.0, z: 1.0 }
    };

    const background = new Cube(gl, seed, backgroundVertexShaderSource, backgroundFragmentShaderSource);

    const terrain = new Sphere(resolution, seed, gl, terrainVertexShaderSource, fragmentShaderSource);
    const ocean = new Sphere(resolution, seed, gl, oceanVertexShaderSource, fragmentShaderSource, true);
    const clouds = new Sphere(resolution, seed, gl, cloudsVertexShaderSource, fragmentShaderSource, true);

    /*
        GL_POINTS, 
        GL_LINE_STRIP, 
        GL_LINE_LOOP, 
        GL_LINES, 
        GL_LINE_STRIP_ADJACENCY, 
        GL_LINES_ADJACENCY, 
        GL_TRIANGLE_STRIP, 
        GL_TRIANGLE_FAN, 
        GL_TRIANGLES, 
        GL_TRIANGLE_STRIP_ADJACENCY, 
        GL_TRIANGLES_ADJACENCY
        GL_PATCHES
    */

    const render = () => {

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);

        background.render(time);

        const mX = movementX;
        const mY = movementY;
        
        if (!pressed) {
            terrain.angle.y -= (0.0025);
        } else {
            terrain.angle.x += mX;
            terrain.angle.y += mY; 
        }
        terrain.render(time, mouse, renderMode);

        if (!pressed) {
            ocean.angle.y -= (0.0025);
        } else {
            ocean.angle.x += mX;            
            ocean.angle.y += mY;
        }
        ocean.render(time, mouse, renderMode);

        if (!pressed) {
            clouds.angle.y -= (0.0025);
        } else {
            clouds.angle.x += mX;            
            clouds.angle.y += mY;
        }
        clouds.render(time, mouse, renderMode);

        movementX -= mX;
        movementY -= mY;

        var curr = (Date.now() / 1000);
        time += curr - last;
        last = curr;

    };

    const loop = () => {
        window.requestAnimationFrame(render);
        window.requestAnimationFrame(loop);
    };

    if (bot) {
        window.requestAnimationFrame(render);
    } else {
        window.requestAnimationFrame(loop);
    }

    const reanderGradientHTML = breakpoints => {

        const element = document.getElementById("gradient");

        console.log(breakpoints);

        element.style.background = `linear-gradient(to right,
            ${breakpoints.map(c => `
                rgb(${255 * c.color[0]}, ${255 * c.color[1]}, ${255 * c.color[2]}) 
                ${c.value * 100}%
            `).join(",")}
        )`;

    };

    reanderGradientHTML(terrain.breakpoints);

});