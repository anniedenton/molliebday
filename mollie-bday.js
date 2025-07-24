const CAT_SCALE = 0.5;
const MOLLIE_SCALE = 0.6
const WIDTH = HEIGHT = 192;
const MOLLIE_SPEED = 10;
const CAT_X = 290;
const CAT_Y = 150;
const RIGHT = 0;
const LEFT = 1;
const PET = 2;

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let keyPresses = {};
// !IMPORTANT!
let prettyKittyMode = true;
let audio = new Audio('prettykitty.m4a');
let frameCount = 0;
let catMood = 0;
let catMoodBase = 1;
let catMoodMax = 8;
let mollieX = 50;
let mollieY = 130;
let mollieMood = 0;
let mollieRow = 0;
let mollieBaseIndex = 0;
let mollieIndex = 0;
let catMouthOpens = 0;
let catImg = new Image();
let mollieImg = new Image();

catImg.src = './cat.png';
mollieImg.src = './mollie.png';
mollieImg.onload = function() {
  gameLoop();
}

window.addEventListener('keydown', keyDownListener, false);
function keyDownListener(event) {
  keyPresses[event.key] = true;
}

window.addEventListener('keyup', keyUpListener, false);
function keyUpListener(event) {
  keyPresses[event.key] = false;
}

function drawImg(img, frameX, frameY, canvasX, canvasY, scale) {
  ctx.drawImage(img,
                frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
                canvasX, canvasY, WIDTH * scale, HEIGHT * scale);
}

function getRow(num) {
  return Math.floor(num / 3);
}

function getIndex(num) {
  return num % 3;
}

function gameLoop() {
  if (mollieX > 205) {
    mollieX = 205;
  }
  if (mollieX < -10) {
    mollieX = -10;
  }

  frameCount++;
  if (frameCount < 25) {
    window.requestAnimationFrame(gameLoop);
    return;
  }
  frameCount = 0;

  if (keyPresses.a || keyPresses.A || keyPresses.ArrowLeft) {
    mollieX -= MOLLIE_SPEED;
    mollieRow = LEFT;
    mollieBaseIndex = 1;
  } else if (keyPresses.d || keyPresses.D || keyPresses.ArrowRight) {
    mollieX += MOLLIE_SPEED;
    mollieRow = RIGHT;
    mollieBaseIndex = 1;
  } else {
    mollieBaseIndex = 0;
  }

  if ((keyPresses.p || keyPresses.P)
     && CAT_X - mollieX < 100) {
    if (prettyKittyMode && catMood > 7) {
      catMoodMax = 9;
      audio.play();
    }
    mollieRow = PET;
    catMoodBase += 2;

  } else {
    mollieIndex == mollieBaseIndex 
    ? mollieIndex = mollieBaseIndex + 1 
    : mollieIndex = mollieBaseIndex;
  }

  catMoodBase > catMoodMax 
  ? catMoodBase = catMoodMax 
  : catMoodBase = catMoodBase;
  
  if (catMoodMax == 9) {
    catMouthOpens++;
    if (catMouthOpens > 8) {
      catMouthOpens = 0;
      catMoodMax = 8;
    }
  }

  catMood++;
  if (catMood > catMoodBase) catMood = catMoodBase - 1;

  mollieMood = catMood + 4;
  if (mollieMood == 5) mollieMood += 1;
  if (mollieMood >= 12) mollieMood -= 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (mollieRow == PET) {
    drawImg(mollieImg, getIndex(mollieMood), getRow(mollieMood), 
            mollieX, mollieY, MOLLIE_SCALE);
  } else {
    drawImg(mollieImg, mollieIndex, mollieRow, mollieX, mollieY, MOLLIE_SCALE);
  }
  drawImg(catImg, getIndex(catMood), getRow(catMood), CAT_X, CAT_Y, CAT_SCALE);
  window.requestAnimationFrame(gameLoop);
}
