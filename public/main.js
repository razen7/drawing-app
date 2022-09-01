const socket = io.connect(location.origin);

const inputEl = document.getElementById('message');
socket.on('new-message', (data) => console.log(data));

socket.on('new-drawing', (data) => {
  noStroke()
  fill(200, 0, 200);
  ellipse(data.mouseX, data.mouseY, 50, 50);
});

addEventListener('load', () => {
  socket.on('history', (history) => {
    for (const data of history) {
      stroke('200', '0', '200');
      strokeWeight(4);
      line(data.prevX, data.prevY, data.currX, data.currY);
    }
  })
});

socket.on('clear-canvas', () => {
  clear();
  setup();
})

function sendMessage(e) {
  socket.emit('chat-message', inputEl.value);
  inputEl.value = '';
}
function clearCanvas(e) {
  socket.emit('clear-canvas');
  clear();
  setup();
}
function setup() {
  createCanvas(400, 400);
  background(220);
}
let prevX, prevY;
function mousePressed() {
  prevX = mouseX;
  prevY = mouseY;
}

function mouseDragged() {
  currX = mouseX;
  currY = mouseY;
  stroke('255', '255', '255');
  strokeWeight(4);
  line(prevX, prevY, currX, currY);
  socket.emit('drawing', { prevX, prevY, currX, currY, color: "255, 255, 255" });
  prevX = currX;
  prevY = currY;
}