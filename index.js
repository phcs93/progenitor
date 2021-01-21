document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.querySelector("canvas");

    const width = canvas.width = canvas.clientWidth;
    const height = canvas.height = canvas.clientHeight;
    
    const gl = canvas.getContext("webgl2");

    const planet = new Planet(250, gl, terrainVertexShaderSource, fragmentShaderSource);   
    const ocean = new Planet(250, gl, oceanVertexShaderSource, fragmentShaderSource, true);

    const render = () => {

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);        

        planet.angle.y -= 0.01;
        planet.render();

        ocean.angle.y -= 0.01;
        ocean.render();

        window.requestAnimationFrame(render);

    };

    render();

});