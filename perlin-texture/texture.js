let canvas = document.getElementById('canvas');
canvas.width = 512;
canvas.height = 512;

let ctx = canvas.getContext('2d');
let selectionMode = 'marble';

let dropdown = document.getElementById('dropdown');
dropdown.value = selectionMode;

dropdown.addEventListener('change', (evt) => {
    selectionMode = evt.target.value;
    setup();
});

function fbm(x, y, f, a) {
    let amp = a;
    let freq = f;

    let tot = 0.0;
    let res = 0.0;
    for (let i = 0; i < 5; ++i) {
        tot += amp;

        res += amp * noise.perlin2(x * freq, y * freq);
        amp *= 0.5;
        freq *= 2.0;
    }

    return res / tot;
}

function mixColor(col1, col2, f) {
    return {
        x: col1.x * (1.0 - f) + f * col2.x,
        y: col1.y * (1.0 - f) + f * col2.y,
        z: col1.z * (1.0 - f) + f * col2.z,
    };
}

function marble(x, y) {
    let c0 = { x: 255, y: 255, z: 255 };
    let c1 = { x: 0, y: 0, z: 0 };

    const a = 1.0;
    const f = 0.01;
    const turbFactor = 10.;
    const scale = 0.03;

    let n = Math.sin((x + y) * scale + fbm(x, y, f, a) * turbFactor) * 0.5 + 0.5;
    let c = mixColor(c0, c1, n * n);
    return getColor(c.x, c.y, c.z, 1.0);
}

function wood(x, y) {
    let c0 = { x: 204, y: 125, z: 41 };
    let c1 = { x: 82, y: 46, z: 8 };
    const a = 1.0;
    const f = 0.02;
    const turbFactor = 8.;
    const scale = 0.3;

    x = canvas.width * 0.5 - x;
    y = canvas.height * 0.5 - y;
    const len = Math.sqrt(x * x + y * y);
    const d = Math.sin(len * scale + fbm(x, y, f, a) * turbFactor);
    let c = mixColor(c0, c1, d);
    return getColor(c.x, c.y, c.z, 1.0);
}

function xor(x, y) {
    let res = (x ^ y) % 256;
    return getColor(res, res, res, 1.0);
}

function checker(x, y)
{
    x /= 32;
    y /= 32;
    let res = ((Math.floor(x) + Math.floor(y)) % 2.0) * 255;
    return getColor(res, res, res, 1.0);
}

function getColor(r, g, b, a) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function setup() {
    draw();
}

function draw() {
    for (let y = 0; y < canvas.height; ++y) {
        for (let x = 0; x < canvas.width; ++x) {
            if (selectionMode === 'marble')
                ctx.fillStyle = marble(x, y);
            else if (selectionMode == 'wood')
                ctx.fillStyle = wood(x, y);
            else if (selectionMode == 'xor')
                ctx.fillStyle = xor(x, y);
            else if(selectionMode == 'checker')
                ctx.fillStyle = checker(x, y);
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

setup();
