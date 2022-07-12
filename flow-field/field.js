let scl = 20.0;
let row, col;
let zOff = 0;

let canvas = document.getElementById('canvas');
canvas.width = 1200;
canvas.height = 800;
let ctx = canvas.getContext('2d');

let flowfield = [];

function createFromAngle(ang)
{
    return {
        x : Math.sin(ang),
        y : Math.cos(ang)
    };
}

function limitVelocity(vx, vy, val)
{
    let mag = Math.sqrt(vx * vx + vy * vy);
    let x = vx / mag;
    let y = vy / mag;

    mag = Math.min(Math.max(-val, mag), val);
    return {
        x : x * mag,
        y : y * mag
    };
}

class Particle {
    constructor() {
        this.x =  Math.random() * canvas.width;
        this.y =  Math.random() * canvas.height;
        this.vx = Math.random() * 2.0 - 1.0;
        this.vy = Math.random() * 2.0 - 1.0;
        this.ax = 0.0;
        this.ay = 0.0;

        this.maxSpeed = 2;
        this.prevX = this.x;
        this.prevY = this.y;

        const h = Math.floor(Math.random() * 360);
        //this.color = `hsl(${h}, 100%, 100%)`;
        this.color = 'hsla('+ 360*Math.random() +',100%, 30%, 0.019)';

    }

    update() {
        this.prevX = this.x;
        this.prevY = this.y;

        this.vx += this.ax;
        this.vy += this.ay;


        this.x += this.vx;
        this.y += this.vy;

        let vel = limitVelocity(this.vx, this.vy, this.maxSpeed);
        this.vx = vel.x;
        this.vy = vel.y;
        
        //this.vel.add(this.acc);
        //this.vel.limit(this.maxSpeed);
        //this.pos.add(this.vel);

        this.ax = 0.0;
        this.ay = 0.0;

        if (this.x > canvas.width || this.x < 0.0)
        {
            this.x = Math.random() * canvas.width;
            this.prevX = this.x;
        }
        if (this.y > canvas.height || this.y < 0.0)
        {
            this.y = Math.random() * canvas.height;
            this.prevY = this.y;
        }
        
    }

    applyForce(force) {
        this.ax += force.x;
        this.ay += force.y;
    }

    follow(flowfield)
    {
        let x = Math.floor(this.x / scl);
        let y = Math.floor(this.y / scl);

        let v = flowfield[y * col + x];
        this.applyForce(v);
    }

    draw() {
        ctx.strokeStyle = this.color;//`rgba(0, 0, 0, ${5 / 255})`;
        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.stroke();
    }
}

let particles = [];
function setup() {

    col = Math.floor(canvas.width / scl);
    row = Math.floor(canvas.height / scl);

    for (let i = 0; i < 5000; ++i)
        particles.push(new Particle());
    
    flowfield =  new Array(col * row);
    draw();
}

function draw() {
    const f = 0.005;
    for (let y = 0; y < row; ++y) {
        for (let x = 0; x < col; ++x) {
            let r = noise.perlin3(x * scl * f, y * scl * f, zOff) * Math.PI * 4;
            let v = createFromAngle(r);
            flowfield[y * col + x] = v;
        }
        zOff += 0.001;
    }

    particles.forEach(particle => {
        particle.follow(flowfield);
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(draw);
}

setup();