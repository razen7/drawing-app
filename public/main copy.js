const socket = io.connect('http://localhost:8000/');

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
      noStroke()
      fill(200, 0, 200);
      ellipse(data.mouseX, data.mouseY, 50, 50);
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
let prevX,prevY;
function mousePressed() {
  prevX=mouseX;
  prevY=mouseY;
}

function mouseDragged() {
  socket.emit('drawing', { mouseX, mouseY });
  noStroke()
  fill(255, 255, 255);
  ellipse(mouseX, mouseY, 50, 50);
}