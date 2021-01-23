document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.querySelector("canvas");

    const width = canvas.width = canvas.clientWidth;
    const height = canvas.height = canvas.clientHeight;
    
    const gl = canvas.getContext("webgl2");    

    let time = 0.0;
    let last = (Date.now() / 1000);

    const terrain = new Sphere(1000, gl, terrainVertexShaderSource, fragmentShaderSource);
    const ocean = new Sphere(1000, gl, oceanVertexShaderSource, fragmentShaderSource, true);
    const clouds = new Sphere(1000, gl, cloudsVertexShaderSource, fragmentShaderSource, true);

    const render = () => {

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);        

        terrain.angle.y -= 0.005;
        terrain.render(time);

        ocean.angle.y -= 0.005;
        ocean.render(time);

        clouds.angle.y -= 0.005;
        clouds.render(time);

        var curr = (Date.now() / 1000);
        time += curr - last;
        last = curr;

        window.requestAnimationFrame(render);

    };

    render();

});