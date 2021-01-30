document.addEventListener("DOMContentLoaded", () => {

    //const url = new URL(window.location.href);

    //url.searchParams.set("seed", url.searchParams.get("seed") || Math.random());

    // const config = {
    //     seed: parseInt(url.searchParams.get("seed")) || Math.random()
    // };

    // for (const p in config) {
    //     url.searchParams.set(p, config[p]);
    // }

    //window.history.replaceState(null, null, url);

    const canvas = document.querySelector("canvas");    

    const width = canvas.width = canvas.clientWidth;
    const height = canvas.height = canvas.clientHeight;
    
    const gl = canvas.getContext("webgl2", {
        preserveDrawingBuffer: true,
        alpha: false,
        antialias: true,
        premultipliedAlpha: true
    });

    let time = 0.0;
    let last = (Date.now() / 1000);

    const terrain = new Sphere(1000, gl, terrainVertexShaderSource, fragmentShaderSource);
    const ocean = new Sphere(1000, gl, oceanVertexShaderSource, fragmentShaderSource, true);
    const clouds = new Sphere(1000, gl, cloudsVertexShaderSource, fragmentShaderSource, true);

    terrain.gradient = [ 
        {value: 0.000, color: [0.018, 0.024, 0.057, 1.000]},
        {value: 0.400, color: [0.318, 0.224, 0.157, 1.000]},
        {value: 0.500, color: [1.000, 1.000, 0.957, 1.000]},
        {value: 0.600, color: [0.314, 0.718, 0.153, 1.000]},
        {value: 0.700, color: [0.082, 0.247, 0.012, 1.000]},
        {value: 0.900, color: [0.318, 0.224, 0.157, 1.000]},
        {value: 1.000, color: [0.937, 0.937, 0.933, 1.000]}
    ];

    var frames = 0;

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

    window.requestAnimationFrame(render);

});