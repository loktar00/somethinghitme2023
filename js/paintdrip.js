const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const dots = [];

canvas.classList.add('effect-canvas');

document.body.append(canvas);

canvas.width = window.innerWidth;
canvas.height = 250;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
});

class dot {
    constructor(canvas) {
        this.canvas = canvas;
        this.create();
    }

    create = () => {
        this.x = Math.random() * this.canvas.width;
        this.size = 1 + Math.random() * 20;
        this.y = -this.size * 2;

        this.color = {
            h: Math.floor(Math.random() * 360),
            s: Math.floor(30 + Math.random() * 20),
            v: Math.floor(50 + Math.random() * 20)
        };

        this.speed = 0.1 + Math.random() * 0.5;
    }

    update = () => {
        this.y += this.speed;

        if (this.y >  this.canvas.height) {
            this.create();
        }
    }

    render = () => {
        ctx.fillStyle = `hsl(${this.color.h},${this.color.s}% ,${this.color.v + this.y * 0.2}%)`;
        ctx.shadowOffsetY = 4;
        ctx.shadowBlur = 2;
        ctx.shadowColor = `hsl(${this.color.h}, 40% ,${50 + this.y * 0.2}%`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
}


function init() {
  for (let i = 0; i < 100; i++) {
    dots.push(new dot(canvas));
  }

  update();
}

function update() {
  dots.forEach((e) => {
    e.update();
  });
  render();
}

function render() {
    requestAnimationFrame(update);

    dots.forEach((dot) => {
        dot.render();
    });
}

init();
