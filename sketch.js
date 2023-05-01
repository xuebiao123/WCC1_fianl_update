// Reference code1 about Camera gestures : https://editor.p5js.org/pixelfelt/sketches/oS5CwSbM1
// Reference code2 about 3D balls : https://openprocessing.org/sketch/1642097

paint = []
let size = 0

// 左右手各点分配
let prevPointer = [
  [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}], //left
  [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}] //right
]

//指尖
let fingertips = [1, 8, 12, 16, 20] 

const particles = []
const particlesSecond = []  
const spheres = []
const pad = 5 
let start = []
let ballexplosion = false
let Explosion = false
let dataAccess = false
let change = 10
let Condition = 0
let x1 = 0
let y1 = 0
let x2 = 0
let y2 = 0
let x3 = 0
let y3 = 0

function setup() {
  
  sketch = createCanvas(windowWidth, windowHeight+20, WEBGL);
  canvas = sketch;
	canvas.position(0,0);
	canvas.style('z-index','-1');
	
  noStroke()

  for (let i = 0; i <= 150; i++) {
    let x = random(-width/2, width/2); // x坐标
    let y = random(-height/2, height/2); // y坐标
    let z = random(-200, 200); // z坐标
    let size = random(0, 5); // 球体大小
    let color = random(200,255);
    spheres.push({ x, y, z, size, color }); // 将球体的坐标和大小存储在数组中
  }


  colorMap = [
    // Left fingertips
    [color(255, 0, 0), color(255, 0, 255), color(0, 0, 255), color(255, 255, 0)],
    // Right fingertips
    [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 255, 0)]
  ]
  
  handsfree = new Handsfree({
    // showDebug: true,  
    hands: true
  })
  // handsfree.enablePlugins('browser')
  // handsfree.plugin.pinchScroll.disable()
  
  handsfree.start()
}


//----------- Class - Particle / Preset ball position size and radius -----------
class particle{
  constructor(x,y){
    hand()
    this.pos = createVector(x || width/2, y || height/2) 
    this.vel = createVector(random(-1,1), random(-1,1)) 
    this.acc = createVector(0,0) 
    this.r = map(size,0.25,1,300,-250) 
    this.r2 = Math.hypot(width, height) / 10 
    this.d = this.r * .4  
    size = 0
  }
}


// ------ drawing backgrounds and others --------
function draw() {
  background(0)

  hand()
  // light
  directionalLight(color(255, 200 ,200), 0, 0, -1) 
	spotLight( 
		color('white'),  
		width/2, height/2, 1e3, 
		0, 0, -1, 
		PI / 16
	)
 
  // start
  
  
  //绘制150个球体
  for (let i = 0; i < 100; i++) {
    start = spheres[i];
    fill(255,255,start.color);
    push(); // 保存当前的变换矩阵
    translate(start.x, start.y, start.z); // 平移变换
    sphere(start.size); // 绘制球体
    pop(); // 恢复之前保存的变换矩阵
  }
  

// -------- explosion effects ------------
if (size > 0.2 && size < 0.30)
{
  dataAccess = true;
}

if (dataAccess == true){
Condition = map(size,0.25,1,10,0.25)
console.log(Condition);
	if(Condition > 10){ 
    ballexplosion = true;
    if ( Explosion == false ){
		  for(let i = 0; i < 100; i++){
			particles.push(new particle());
      }
      ballexplosion = false;
      Explosion = true
    }
	}
}
  
  // Creating the key part of the new sphere pop-up
  for (const p of particles) { 
    p.vel.add(p.acc) 
    p.pos.add(p.vel)
    p.vel.mult(0.98)
    p.acc.mult(0) 
  }


 collideAll([...particles, new particle()]) 

 //------ make sure the ball does not go beyond the border -------
 for (const p of particles) {
  if (p.pos.x < pad) {
    p.pos.x = pad; 
    p.vel.x *= -1
  }
  if (p.pos.y < pad) {
    p.pos.y = pad;
    p.vel.y *= -1
  }
  if (p.pos.x > width - pad) {
    p.pos.x = width - pad;
    p.vel.x *= -1
  }
  if (p.pos.y > height - pad) {
    p.pos.y = height - pad;
    p.vel.y *= -1
  }
  }
  
  const all = [...particles] 

  // 绘制所要交互的形状
  all.forEach(p => {
    push()
    //fill(236,133,124)
    normalMaterial()
    translate(p.pos.x - width/2, p.pos.y - height/2)
    sphere(p.r/10)
    pop()
   }
  )
   
  const allsecond = [new particle()] 
  if (Explosion == false){

   allsecond.forEach(p => {
    push()
    //fill(255)
    normalMaterial()
    translate(p.pos.x - width/2, p.pos.y - height/2)
    sphere(p.r)
    pop()

    push()
    fill('blue')
    translate(p.pos.x - width/2- 300, p.pos.y  - height/2)
    ellipsoid(p.r-100,p.r,p.r)
    pop()

    push()
    fill(255)
    translate(p.pos.x - width/2 + 300, p.pos.y - height/2)
    ellipsoid(p.r-100,p.r,p.r)
    pop()

    push()
    fill('blue')
    translate(p.pos.x - width/2 , p.pos.y - height/2 - 300)
    ellipsoid(p.r,p.r-100,p.r)
    pop()

    push()
    fill(255)
    translate(p.pos.x - width/2 , p.pos.y - height/2 + 300)
    ellipsoid(p.r,p.r-100,p.r)
    pop()
  })
}
  else if(Explosion == true){
  
    // 绘制所要交互的形状
  allsecond.forEach(p => {
    push()
    translate(p.pos.x - width/2, p.pos.y - height/2)
    let changelate = p.r - change
    if (changelate < 0)
  {
    sphere(0)
  }
    else {
      sphere(changelate)
  }
    pop()
  })
  change += 40
  size = 0;
  }
}

//----------- collision ------------   // 发生碰撞后会发生的行为
function collideAll(p) {
  for (let i = p.length; i--;) 
    for (let j = i; j--;) 
    collide(p[i], p[j]) 
}

function collide(current, other) { 
  const dir = p5.Vector.sub(current.pos, other.pos) 
  const dis = Math.hypot(dir.x, dir.y) 
  const sum = current.r + other.r 
  if (sum > dis) { 
    const repel = dir.div(dis).mult((sum - dis) / current.d) 
    current.acc.add(repel)
    other.acc.sub(repel)
  }

  size = 0;
}

// ----------- Gestures ---------------
function hand() {
  const hands = handsfree.data?.hands
  
  if (!hands?.landmarks) return 
  
  // Draw keypoints
  hands.landmarks.forEach((hand, handIndex) => {
    hand.forEach((landmark, landmarkIndex) => {

      fill(color(255, 255, 255))
      circleSize = 10
      // Set stroke
      if (handIndex === 1 && landmarkIndex === 1) {
        x1 = landmark.x;
        y1 = landmark.y;
      }
      else if (handIndex === 1 && landmarkIndex === 8) {
        x2 = landmark.x;
        y2 = landmark.y;
      }
      else if (handIndex === 1 && landmarkIndex === 20) {
        x3 = landmark.x;
        y3 = landmark.y;
      }
      size = dist(x1,y1,x2,y2)+dist(x1,y1,x3,y3);
      console.log(size);
      // circle(
      //   // Flip horizontally
      //   sketch.width/4 - landmark.x * sketch.width + 350,
      //   landmark.y * sketch.height - sketch.height/2,
      //   size*100
      // )
     })
  })
  
}

// function mousePressed() {
//   //full window display
// if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight) {
//  let fs = fullscreen()
//  fullscreen(!fs)
// }
// }