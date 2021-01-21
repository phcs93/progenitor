function Sphere (resolution) { // http://www.songho.ca/opengl/gl_sphere.html

    const stackCount = resolution % 2 === 0 ? resolution + 1 : resolution;
    const sectorCount = (stackCount * 2) + 1;

    const stackStep = Math.PI / stackCount;
    const sectorStep = 2 * Math.PI / sectorCount;
    
    this.positions = [];
    this.indexes = [];

    for (let i = 0; i <= stackCount; i++) {
        for(let j = 0; j <= sectorCount; j++) {
            const lat = Math.PI / 2 - i * stackStep;
            const lon = j * sectorStep;
            const x = Math.cos(lat) * Math.cos(lon);
            const y = Math.sin(lat);
            const z = Math.cos(lat) * Math.sin(lon);
            this.positions.push(x,y,z);
        }
    }

    for(let i = 0; i < stackCount; i++) {
        let k1 = i * (sectorCount + 1);
        let k2 = k1 + sectorCount + 1;
        for(let j = 0; j < sectorCount; j++, k1++, k2++) {
            if (i != 0) this.indexes.push(k1,k2,k1+1);
            if (i != (stackCount-1)) this.indexes.push(k1+1,k2,k2+1);
        }
    }

}