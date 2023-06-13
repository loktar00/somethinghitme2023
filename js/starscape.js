const background = document.createElement('canvas');
const bgCtx = background.getContext('2d');
const width = window.innerWidth;
const height = 800;

let lightMode = document.documentElement.getAttribute('data-theme'); 

background.width = width;
background.height = height;

document.body.append(background);
background.style.position = 'absolute';
background.style.top = '0';
background.style.left = '0';

function Terrain(options = {}) {
    this.terrain = document.createElement("canvas");
    this.terCtx = this.terrain.getContext("2d");

    this.terrain.style.position = 'absolute';
    this.terrain.style.top = '0';
    this.terrain.style.left = '0';

    this.scrollDelay = options.scrollDelay || 90;
    this.lastScroll = new Date().getTime();

    this.terrain.width = width;
    this.terrain.height = height;
    this.mHeight = options.mHeight || height;

    // generate
    this.points = [];

    let displacement = options.displacement || 140;
    const power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2))));

    // set the start height and end height for the terrain
    this.points[0] = this.mHeight;//(this.mHeight - (Math.random() * this.mHeight / 2)) - displacement;
    this.points[power] = this.points[0];

    // create the rest of the points
    for (var i = 1; i < power; i *= 2) {
        for (var j = (power / i) / 2; j < power; j += power / i) {
            this.points[j] = ((this.points[j - (power / i) / 2] + this.points[j + (power / i) / 2]) / 2) + Math.floor(Math.random() * -displacement + displacement);
        }
        displacement *= 0.6;
    }

    const maxHeight = Math.max(...this.points);

    // Fillstyle, it's down here just in case it's a gradient we need the max height.
    if (Array.isArray(options.darkFillStyle)) {
        // Gradient is an array and will evenly create color stops. This starts from the bottom of the screen
        // and moves up to the max height of the mountain (divided by 4 since our moiuntains are 1/4 of the screen)
        // Since it's backwards, we need to reverse the array of colors.
        const gradient = bgCtx.createLinearGradient(0, height, 0, maxHeight / 4);

        options.darkFillStyle.reverse();

        // Add color stops
        options.darkFillStyle.forEach((color, idx, arr) => {
            const stop = (100 / arr.length) * idx * 0.01;
            gradient.addColorStop(stop, color);
        });

        this.darkFillStyle = gradient;
    } else {
        this.darkFillStyle = options.darkFillStyle || "#191D4C";
    }

    // Do the same for the light fillstyle
    if (Array.isArray(options.lightFillStyle)) {
        // Gradient is an array and will evenly create color stops. This starts from the bottom of the screen
        // and moves up to the max height of the mountain (divided by 4 since our moiuntains are 1/4 of the screen)
        // Since it's backwards, we need to reverse the array of colors.
        const gradient = bgCtx.createLinearGradient(0, height, 0, maxHeight / 4);

        options.lightFillStyle.reverse();

        // Add color stops
        options.lightFillStyle.forEach((color, idx, arr) => {
            const stop = (100 / arr.length) * idx * 0.01;
            gradient.addColorStop(stop, color);
        });

        this.lightFillStyle = gradient;
    } else {
        this.lightFillStyle = options.lightFillStyle || "#191D4C";
    }

    document.body.appendChild(this.terrain);
}

Terrain.prototype.update = function () {
    // draw the terrain
    this.terCtx.clearRect(0, 0, width, height);
    this.terCtx.fillStyle = this.lightFillStyle;

    if (lightMode === 'dark') {
        this.terCtx.fillStyle = this.darkFillStyle;
    }
    this.terCtx.fillStyle = this.fillStyle;

    if (Date.now() > this.lastScroll + this.scrollDelay) {
        this.lastScroll = Date.now();
        this.points.push(this.points.shift());
    }

    const terrainPath = new Path2D();

    for (let i = 0; i <= width; i++) {
        if (i === 0) {
            terrainPath.moveTo(0, this.points[0]);
        } else if (this.points[i] !== undefined) {
            terrainPath.lineTo(i, this.points[i]);
        }
    }

    terrainPath.lineTo(width, this.terrain.height);
    terrainPath.lineTo(0, this.terrain.height);
    terrainPath.lineTo(0, this.points[0]);
    terrainPath.closePath();

    this.terCtx.fill(terrainPath);
}

// Second canvas used for the stars
bgCtx.fillStyle = '#05004c';
bgCtx.fillRect(0, 0, width, height);

// stars
function Star(options) {
    this.size = Math.random() * 2;
    this.speed = Math.random() * .05;
    this.x = options.x;
    this.y = options.y;
}

Star.prototype.reset = function () {
    this.size = Math.random() * 2;
    this.speed = Math.random() * .05;
    this.x = width;
    this.y = Math.random() * height;
}

Star.prototype.update = function () {
    if (lightMode !== 'dark') {
        return;
    }
    this.x -= this.speed;
    if (this.x < 0) {
        this.reset();
    } else {
        bgCtx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function ShootingStar() {
    this.reset();
}

ShootingStar.prototype.reset = function () {
    this.x = Math.random() * width;
    this.y = 0;
    this.len = (Math.random() * 80) + 10;
    this.speed = (Math.random() * 10) + 6;
    this.size = (Math.random() * 1) + 0.1;
    // this is used so the shooting stars arent constant
    this.waitTime = new Date().getTime() + (Math.random() * 3000) + 500;
    this.active = false;
}

ShootingStar.prototype.update = function (lightMode = 'dark') {
    if (lightMode !== 'dark') {
        return;
    }

    if (this.active) {
        this.x -= this.speed;
        this.y += this.speed;
        if (this.x < 0 || this.y >= height) {
            this.reset();
        } else {
            bgCtx.lineWidth = this.size;
            bgCtx.beginPath();
            bgCtx.moveTo(this.x, this.y);
            bgCtx.lineTo(this.x + this.len, this.y - this.len);
            bgCtx.stroke();
        }
    } else {
        if (this.waitTime < new Date().getTime()) {
            this.active = true;
        }
    }
}

let entities = [];

// init the stars
for (var i = 0; i < height; i++) {
    entities.push(new Star({
        x: Math.random() * width,
        y: Math.random() * height
    }));
}

// Add 2 shooting stars that just cycle.
entities.push(new ShootingStar());
entities.push(new ShootingStar());

entities.push(new Terrain({
    mHeight : (height/2)-120, 
    darkFillStyle: "#191D4C", 
    lightFillStyle : "#a7d0c9"
}));

entities.push(new Terrain({
    displacement : 120, 
    scrollDelay : 50,  
    darkFillStyle: "rgb(17,20,40)",
    lightFillStyle : "#6bb9ab",
    mHeight : (height/2)-60
}));

entities.push(new Terrain({
    displacement : 100, 
    scrollDelay : 20, 
    darkFillStyle: "rgb(10,10,5)",
    lightFillStyle : ['#8bd4c7', '#ffffff'],
    mHeight : height/2
}));


//animate background
function animate() {
    if (lightMode === 'dark') {
        bgCtx.fillStyle = '#110E19';
        bgCtx.fillRect(0, 0, width, height);
        bgCtx.fillStyle = '#ffffff';
        bgCtx.strokeStyle = '#ffffff';
    } else {
        // Gradient for the sky
        const gradient = bgCtx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#86d6f7');
        gradient.addColorStop(0.5, "#edf8fa");

        bgCtx.fillStyle = gradient;
        bgCtx.fillRect(0, 0, width, height);
        bgCtx.fillStyle = '#ffffff';
        bgCtx.strokeStyle = '#ffffff';
    }

    let entLen = entities.length;

    while (entLen--) {
        entities[entLen].update(lightMode);
    }

    requestAnimationFrame(animate);
}

animate();

(() => {
    const targetNode =  document.documentElement;
    const config = { attributes: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList) => {
        for (const mutation of mutationList) {
            if (mutation.type === 'attributes') {
                if (mutation.attributeName === 'data-theme') {
                    lightMode = document.documentElement.getAttribute('data-theme');
                }
            }
        }
    };
    
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();