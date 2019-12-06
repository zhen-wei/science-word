// 玩家物件座標
let player = {x:0};
// 移動量
let moving = {v:0.5}
// dat.GUI
let gui = new dat.GUI();
gui.add(moving,"v",0.1,2).step(0.1).onChange(function(value){});

let canvas = document.getElementById("mycanvas");
let ctx = canvas.getContext("2d");
// 動畫圖
let img1 = new Image();
img1.src = "img/光柵.png"
// 光柵圖
let img2 = new Image();
img2.src = "img/光柵2.png"

// 初始化畫布
let initCanvas = () => {
  winw = canvas.width = window.innerWidth;
  winh = canvas.height = window.innerHeight;
  ctx.drawImage(img1,0,0);
}

// 讀取完後加載
let loaded = () => {
  initCanvas();
  player.x = 0;
  requestAnimationFrame(draw);
}

window.addEventListener("load",loaded);
window.addEventListener("resize",initCanvas);


// 左右鍵
let rightPressed = false;
let leftPressed = false;

// 按下按鈕
let keyDownHandler = (e) => {
  if(e.keyCode == 39) {
    rightPressed = true;
  }
  else if(e.keyCode == 37) {
    leftPressed = true;
  }
}
// 放開按鈕
let keyUpHandler = (e) => {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// 移動palyer
let playermoving = (obj) => {
  if(rightPressed) {
    obj.x += moving.v;
  }
  else if(leftPressed) {
    obj.x -= moving.v;
  }
}
// 繪製
let draw = () => {
  initCanvas();
  playermoving(player);
  ctx.drawImage(img2,player.x,0);
  requestAnimationFrame(draw);
}