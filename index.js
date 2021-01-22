document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.querySelector("canvas");

    const width = canvas.width = canvas.clientWidth;
    const height = canvas.height = canvas.clientHeight;
    
    const gl = canvas.getContext("webgl2");

    const terrain = new Sphere(100, gl, terrainVertexShaderSource, fragmentShaderSource);   
    const ocean = new Sphere(100, gl, oceanVertexShaderSource, fragmentShaderSource, true);
    const clouds = new Sphere(100, gl, cloudsVertexShaderSource, fragmentShaderSource, true);

    const render = () => {

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);        

        terrain.angle.y -= 0.01;
        terrain.render();

        ocean.angle.y -= 0.01;
        ocean.render();

        clouds.angle.y -= 0.005;
        clouds.render();

        window.requestAnimationFrame(render);

    };

    render();

});