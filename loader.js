// loader.js
const canvas = document.getElementById("loader-canvas");
const context = canvas.getContext("2d");
const points = [];
const velocity2 = 5;
const boundaryX = canvas.width;
const boundaryY = canvas.height;
const numberOfPoints = 30;
const radius = 5;

initLoader();

function initLoader() {
  for (let i = 0; i < numberOfPoints; i++) createPoint();
  for (let i = 0; i < points.length; i++) {
    points[i].buddy = points[i === 0 ? points.length - 1 : i - 1];
  }
  animateLoader();
}

function createPoint() {
  const point = {};
  point.x = Math.random() * boundaryX;
  point.y = Math.random() * boundaryY;
  point.vx = (Math.random() * 2 - 1);
  const vx2 = point.vx ** 2;
  const vy2 = velocity2 - vx2;
  point.vy = Math.sqrt(Math.abs(vy2)) * (Math.random() > 0.5 ? 1 : -1);
  points.push(point);
}

function resetVelocity(point, axis, dir) {
  if (axis === 'x') {
    point.vx = dir * Math.random();
    const vx2 = point.vx ** 2;
    const vy2 = velocity2 - vx2;
    point.vy = Math.sqrt(Math.abs(vy2)) * (Math.random() > 0.5 ? 1 : -1);
  } else {
    point.vy = dir * Math.random();
    const vy2 = point.vy ** 2;
    const vx2 = velocity2 - vy2;
    point.vx = Math.sqrt(Math.abs(vx2)) * (Math.random() > 0.5 ? 1 : -1);
  }
}

function drawCircle(x, y) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fillStyle = '#97badc';
  context.fill();
}

function drawLine(x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.strokeStyle = '#8ab2d8';
  context.stroke();
}

function drawLoader() {
  for (let point of points) {
    point.x += point.vx;
    point.y += point.vy;
    drawCircle(point.x, point.y);
    drawLine(point.x, point.y, point.buddy.x, point.buddy.y);

    if (point.x < radius) resetVelocity(point, 'x', 1);
    else if (point.x > boundaryX - radius) resetVelocity(point, 'x', -1);
    else if (point.y < radius) resetVelocity(point, 'y', 1);
    else if (point.y > boundaryY - radius) resetVelocity(point, 'y', -1);
  }
}

function animateLoader() {
  context.clearRect(0, 0, boundaryX, boundaryY);
  drawLoader();
  requestAnimationFrame(animateLoader);
}