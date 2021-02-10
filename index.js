document.addEventListener("DOMContentLoaded", () => {

    const url = new URL(window.location.href);
    const bot = url.searchParams.get("bot");
    const seed = parseFloat(url.searchParams.get("seed")) || Math.random();

    const canvas = document.querySelector("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const gl = canvas.getContext("webgl2", {
        preserveDrawingBuffer: true,
        alpha: false,
        antialias: true,
        premultipliedAlpha: true
    });

    let time = 0.0;
    let last = (Date.now() / 1000);

    const resolution = bot ? 300 : 500;

    const background = new Cube(gl, seed, backgroundVertexShaderSource, backgroundFragmentShaderSource);

    const terrain = new Sphere(resolution, seed, gl, terrainVertexShaderSource, fragmentShaderSource);
    const ocean = new Sphere(resolution, seed, gl, oceanVertexShaderSource, fragmentShaderSource, true);
    const clouds = new Sphere(resolution, seed, gl, cloudsVertexShaderSource, fragmentShaderSource, true);

    const render = () => {

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);

        background.render(time);

        terrain.angle.y -= 0.0025;
        terrain.render(time);

        ocean.angle.y -= 0.0025;
        ocean.render(time);

        clouds.angle.y -= 0.0025;
        clouds.render(time);

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

});