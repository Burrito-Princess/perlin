'use strict';
let grid = [];
let nodes = 4;

let perlin = {
  rand_vect: function () {
    let theta = Math.random() * 2 * Math.PI;
    let tree = Math.floor(Math.random()*2);
    return { x: Math.cos(theta), y: Math.sin(theta), t: tree};
  },
  dot_prod_grid: function (x, y, vx, vy) {
    let g_vect;
    let d_vect = { x: x - vx, y: y - vy };
    if (this.gradients[[vx, vy]]) {
      g_vect = this.gradients[[vx, vy]];
    } else {
      g_vect = this.rand_vect();
      this.gradients[[vx, vy]] = g_vect;
    }
    return {vect: d_vect.x * g_vect.x + d_vect.y * g_vect.y, t: g_vect.t};
  },
  smoother: function (x) {
    return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
  },
  interp: function (x, a, b) {
    return a + this.smoother(x) * (b - a);
  },
  seed: function () {
    this.gradients = {};
    this.memory = {};
  },
  get: function (x, y, c) {
    if (this.memory.hasOwnProperty([x, y])) return this.memory[[x, y]];
    let xf = Math.floor(x);
    let yf = Math.floor(y);

    //define the corners
    let tl = this.dot_prod_grid(x, y, xf, yf).vect;
    let tr = this.dot_prod_grid(x, y, xf + 1, yf).vect;
    let bl = this.dot_prod_grid(x, y, xf, yf + 1).vect;
    let br = this.dot_prod_grid(x, y, xf + 1, yf + 1).vect;
    //
    let xt = this.interp(x - xf, tl, tr);
    let xb = this.interp(x - xf, bl, br);

    let v = this.interp(y - yf, xt, xb);

    // debugger;
    // console.log(t);
    
    
    v = Math.floor(v*c);
    return v; 

  },
};
perlin.seed();