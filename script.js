const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const cw = canvas.width = window.innerWidth;
const ch = canvas.height = window.innerHeight;

let direction = 0;
let speed = 1;
let skierX = cw/2;
let obstacles = [];
let game = false;
let keys = true;
let totalY = 0;

// Draw an obstacle
function drawObstacle(ctx,type,x,y,h,w){
  
  if (type === 'tree'){
    
    ctx.fillStyle='#624D6E';
    const tree = new Path2D();
      tree.moveTo(x+w/2, y);
      tree.lineTo(x, y+h*0.9);
      tree.lineTo(x+w*0.33, y+h*0.85);
      tree.lineTo(x+w*0.33, y+h);
      tree.lineTo(x+w*0.66, y+h);
      tree.lineTo(x+w*0.66, y+h*0.85);
      tree.lineTo(x+w, y+h*0.9);
      tree.closePath();
    ctx.fill(tree);
    
  } else if (type === 'mound'){
    
    ctx.strokeStyle='#868999';
    ctx.lineWidth=1;
    const mound = new Path2D();
      mound.moveTo(x, y);
      mound.quadraticCurveTo(x+w/2,y-h,x+w, y);
    ctx.stroke(mound);
    
 } else {
   console.error('Drawing error');
 }
}

// Create a new obstacle
function createObstacle(){
  const obstacleTypes = ['tree','mound'];
  const type = obstacleTypes[Math.round(Math.random())];
  
  if (type === 'tree'){
    const treeHeight = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
    obstacles.push({
      type: 'tree',
      x: Math.round(cw*Math.random()),
      y: ch,
      height: treeHeight,
      width: treeHeight/2
    });
  } else if (type === 'mound'){
    const moundWidth = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
    obstacles.push({
      type: 'mound',
      x: Math.round(cw*Math.random()),
      y: ch,
      height: moundWidth/2,
      width: moundWidth
    });
  } else {
     console.error('Creation error');
   }
    
  if(obstacles.length>0 && obstacles[0].y < 0 -obstacles[0].height){
     obstacles.shift();
  }
  
}

// Draw Canvas
function draw() { 
  ctx.clearRect(0, 0, cw, ch);
  totalY++;
  
  ctx.fillStyle='#9B000F';
  
  if (totalY<10){
    ctx.textAlign="center"; 
    ctx.fillStyle='#111213';
    ctx.font = "40px Helvetica";
    ctx.fillText(`SkiFree!`,cw/2,60);
    ctx.font = "20px Helvetica";
    ctx.fillText(`Press an arrow key to start`,cw/2,100);
    ctx.font = "16px Helvetica";
    ctx.fillText(`Use ← and → to steer`,cw/2,124);
    ctx.fillStyle='#E8E9EE';
  }

  // Score
  ctx.textAlign="start"; 
  ctx.font = "14px Helvetica";
  ctx.fillText(`Score: ${Math.floor((totalY-1)/4)} feet`,10,25);
  
  // Draw Skier
  const skier = new Path2D();
        skier.moveTo(skierX-4-direction*2, ch/4);
        skier.lineTo(skierX-1-direction*2, ch/4);
        skier.lineTo(skierX-1+direction*2, ch/4+16);
        skier.lineTo(skierX-4+direction*2, ch/4+16);
        skier.closePath();
        skier.moveTo(skierX+4-direction*2, ch/4);
        skier.lineTo(skierX+1-direction*2, ch/4);
        skier.lineTo(skierX+1+direction*2, ch/4+16);
        skier.lineTo(skierX+4+direction*2, ch/4+16);
        skier.closePath();
  ctx.fill(skier);
  
  // Update obstacle postions
  obstacles = obstacles.map(function(obstacle){
    return {
      type: obstacle.type,
      x: obstacle.x,
      y: obstacle.y-speed,
      height: obstacle.height,
      width: obstacle.width
    }     
  });
  
  // Update skier position and make sure it stay in the window
  if (skierX < 0){
    skierX += Math.abs(direction/2);
  } else if (skierX>cw) {
    skierX -= Math.abs(direction/2);
  } else {
    skierX += direction/2;
  }

  obstacles.forEach(function(obstacle) {
    // Draw Obstacles
    drawObstacle(ctx,
                  obstacle.type,
                  obstacle.x,
                  obstacle.y,
                  obstacle.height,
                  obstacle.width);
    
    // Detect Crash
    if (obstacle.y+obstacle.height > ch/4 - 16
        && obstacle.y < ch/4
        && obstacle.x-obstacle.width/2 < skierX 
        && obstacle.x+obstacle.width/2 > skierX 
        && obstacle.type == 'tree'){
      console.log('crash!');
      stopGame();
      game = false;

      ctx.fillStyle='#9B000F';
      ctx.font = "16px Helvetica";
      ctx.fillText(`YOU CRASHED!!!`,10,60);
      ctx.fillStyle='#111213';
      ctx.fillText(`You traveled ${Math.floor((totalY-1)/4)} feet.`,10,80);
      ctx.fillText(`Press space to restart.`,10,100);
    }
  });
  
}

function handleKey(e){
  const key = e.key;  
  const keycode = e.keyCode;  

  if (keys){
    if(key === "ArrowLeft" && direction > -2){
      direction--;
    } else if (key === "ArrowRight" && direction < 2){
      direction++;
    };
    // else if (key === "ArrowDown"){
    //   speed++;
    // }else if (key === "UpDown"){
    //   speed--;
    // };
    
    if(key === "ArrowLeft" || "ArrowRight" ||"ArrowUp" || "ArrowDown"){
      startGame();
      game = true;
    } 
  }
  
  if (keycode===32 && game === false){
      window.location.reload(true);
  }
  
}

function startGame(){
  if (!game){
    console.log('game on!');
    obstacleInterval = setInterval(createObstacle,50);
    gameInterval = setInterval(draw,1);
  } 
}

function stopGame(){
  if(game){
    clearInterval(obstacleInterval);
    clearInterval(gameInterval);
    keys = false;
  }
}

document.addEventListener('keydown',  handleKey);

draw();