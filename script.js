let fps = 33.3;
let showMouse = true;
let bgColor = "#000";

// 粒子系統陣列
let particles = [];
// 力場系統陣列
let forces = [];

// 控制
let controls = {
  // 粒子數量
  count: 3,
  // 隨機速度值
  randomV: 15,
  // 隨機大小
  randomR: 30,
  // 重力
  ay: 0.2,
  // 粒子縮小倍率
  fade: 0.96,
  glow: 0,
  countarray: particles.length,
  fps_6: false
};

dat.GUI
let gui = new dat.GUI();
gui.add(controls,"count",0,30).step(1).onChange(function(value){});
gui.add(controls,"randomV",0,30).step(1).onChange(function(value){});
gui.add(controls,"randomR",0,50).step(1).onChange(function(value){});
gui.add(controls,"ay",-1,1).step(0.01).onChange(function(value){});
gui.add(controls,"fade",0,0.99).step(0.01).onChange(function(value){});
gui.add(controls,"countarray",0,5000);
gui.add(controls,"glow",0,20).step(1).onChange(function(value){});
gui.add(controls,"fps_6").onChange(function(bool){
  bool===true?fps=16.6:fps=33.3;
});

// ===fps
var stats = new Stats();
stats.showPanel( 0 );  
document.body.appendChild( stats.dom );
// =====

// 粒子物件
class Particle{
  constructor(args){
    //默認值 (defaults)
    this.p = new Vec2();
    this.v = new Vec2();
    this.a = new Vec2();
    this.r = 10;
    this.color = "#fff";
    // 複製物件屬性、合成物件屬性 (合成對象, 來源)
    Object.assign(this,args);
  }
  drawParticle(){
    ctx.save();
    
    ctx.beginPath();
    ctx.translate(this.p.x,this.p.y);
    ctx.arc(0,0,this.r,0,Math.PI*2);
    // 光暈
    ctx.shadowColor = this.color;
    ctx.shadowBlur = controls.glow;
    
    ctx.fillStyle = this.color;
    ctx.fill();
    

    
    
    ctx.restore();
  }
  updateParticle(){
    // 位置 = 位置+速度
    this.p = this.p.add(this.v);
    // 速度 = 速度+加速度
    this.v = this.v.add(this.a);
    // 重力場
    this.v.move(0,controls.ay);
    // 摩擦力（衰減）
    this.v = this.v.mul(0.99);
    this.r = this.r*controls.fade;
    
    // 粒子碰撞
    // 上邊、右邊
    if(this.p.y+this.r > winh) {
      // 絕對值(v的y值)
      this.v.y = -Math.abs(this.v.y)
    }
    
    if(this.p.x+this.r > winw) {
      
    // 絕對值(v的y值)
      this.v.x = -Math.abs(this.v.x)
    }
    // 左邊、下邊
    if (this.p.y-this.r < 0) {
      this.v.y = Math.abs(this.v.y)
    }
    if(this.p.x-this.r < 0) {
      this.v.x = Math.abs(this.v.x)
    }
  }
}
// 力場
class Forcefield{
  constructor(args) {
    this.p = new Vec2()
    this.value = -100
    
    // 反比平方用
    // this.value = -1000
    Object.assign(this,args)
  }
  drawForcefield(){
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.p.x,this.p.y);
    // 圓半徑 = 開根號（立場大小）
    ctx.arc(0,0,Math.sqrt(Math.abs(this.value)),0,Math.PI*2);
    ctx.fillStyle="#fff";
    ctx.fill();
    
    ctx.restore();
  }
  // 引力或吸力
  affect(particle) {
    // 粒子位置-力場的位置
    let delta = particle.p.sub(this.p);
    // 力場長度（大小） 和距離成反比 (避免除0 所以加1)
    let len = this.value/(1+delta.length);
    // 力場長度（大小） 和距離成反比平方
    // let len = this.value/(1+Math.pow(delta.length,2));
    // 力場力量（吸力）
    let force = delta.unit.mul(len);
    particle.v.move(force.x,force.y);
  }
}


// =================================
// 向量
class Vec2{
  constructor(x = 0,y = 0) {
    this.x = x;
    this.y = y;
  }
  // 設定座標
  set(x,y){
    this.x = x;
    this.y = y;
  }
  // 移動
  move(x,y){
    this.x+=x;
    this.y+=y;
  }
  // 加向量
  add(v){
    return new Vec2(this.x+v.x,this.y+v.y)
  }
  // 減向量
  sub(v){
    return new Vec2(this.x-v.x,this.y-v.y)
  }
  // 乘向量
  mul(s){
    return new Vec2(this.x*s,this.y*s)
  }
  // 取得向量長度
  get length(){
    return Math.sqrt(this.x*this.x+this.y*this.y)
  }
  // 設向量長度
  set length(nv) {
    let temp = this.unit.mul(nv)
    this.set(temp.x,temp.y)
  }
  // 複製向量
  clone(){
    return new Vec2(this.x,this.y)
  }
  // 以字串輸出時顯示
  toString(){
    return `(${this.x},${this.y})`
  }
  // 判斷向量相等
  equal(v){
    return this.x == v.x && this.y == v.y
  }
  // 角度
  get angle(){
    return Math.atan2(this.y,this.x)
  }
  // 單位向量
  get unit(){
    return this.mul(1/this.length)
  }
}
// ===========================================

// 畫布
let canvas = document.getElementById("mycanvas");
let ctx = canvas.getContext("2d", { alpha: false });

// 初始化canvas
let initCanvas = () => {
  winw = canvas.width = window.innerWidth;
  winh = canvas.height = window.innerHeight;
}

// 邏輯初始化
let init = () => {
  
}
// 邏輯更新
let lastTime = 0;
let deltaTime;
let update = (timestamp) => {
  deltaTime = timestamp - lastTime;

  // 生成粒子陣列
  let generate = Array.from({length: controls.count},(d,i) => {
    return new Particle({
      p: mousePos.clone(),
      v: new Vec2(Math.random()*controls.randomV-controls.randomV/2 ,
                  Math.random()*controls.randomV-controls.randomV/2),
      r: Math.random()*controls.randomR,
      color: `rgb(255,${parseInt(Math.random()*255)},${parseInt(Math.random()*150)})`
    })
  })
  // concat()合併陣列
  particles = particles.concat(generate);
// 粒子更新
  particles.forEach(p => {p.updateParticle()})
  // 移除過小的粒子
  particles.forEach((p,pid) => {
    
    if(p.r<0.1){
      // 陣列切片
      particles.splice(pid,1)
    }
    forces.forEach(f => f.affect(p));
  })
  
  if (deltaTime >= (fps)) {
    lastTime = timestamp;
    requestAnimationFrame(draw);
    // fps = parseInt(1000/deltaTime)
    stats.update();
    controls.countarray = particles.length
    gui.__controllers[5].updateDisplay()
  }
  
  requestAnimationFrame(update);
}


// 繪製圓形
ctx.circle = function(v,r) {
  this.arc(v.x,v.y,r,0,Math.PI*2)
}

// 繪製線條
ctx.line = function(v1,v2) {
  this.moveTo(v1.x,v1.y)
  this.lineTo(v2.x,v2.y)
}

// 繪製畫面
let draw = (timestamp) => {
  // 清空背景  
  ctx.clearRect(0,0,winw,winh);
  
  // ===========================================
  // 在這裡位置繪製
  
  particles.forEach(p => (p.drawParticle()));
  forces.forEach(p => (p.drawForcefield()));
  
  
  // =========================================
  // 滑鼠
  // 原點
  ctx.fillStyle="red";
  ctx.beginPath(); // 開始繪製
  ctx.circle(mousePos,3);
  ctx.fill(); // 結束繪製
  
  // 十字線與文字
  ctx.save() // 存初始座標
  
  ctx.beginPath()
  ctx.translate(mousePos.x,mousePos.y) // 起筆位置
  ctx.strokeStyle="red" // 畫線樣式
  let len = 20 // 線段長度
  ctx.line(new Vec2(-len,0),new Vec2(len,0))
  ctx.fillText(mousePos,10,-10)
  ctx.rotate(Math.PI/2) // 旋轉
  ctx.line(new Vec2(-len,0),new Vec2(len,0))
  ctx.stroke()
  
  ctx.restore() // 恢復初始座標
}

// 載入完成後
let loaded = () => {
  initCanvas();
  init();
  update()
  // setInterval(update,1000/updateFPS);
}


// 
window.addEventListener("load",loaded);
window.addEventListener("resize",initCanvas);


// =========顯示鼠標所指位置

// 設定滑鼠位置
let mousePos = new Vec2(0,0);
let mousePosDown = new Vec2(0,0);
let mousePosUp = new Vec2(0,0);

// 滑鼠移動
let mousemove = (evt) => {
  mousePos.set(evt.x,evt.y);
  // console.log(mousePos);
}

let dblclick = (evt) => {
  mousePos.set(evt.x,evt.y);
  forces.push(new Forcefield({
    p: mousePos.clone()
  }));
}
window.addEventListener("mousemove",mousemove);
window.addEventListener("dblclick",dblclick);