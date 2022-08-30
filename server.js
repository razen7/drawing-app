const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(express.static("public"));
app.use(cors());

const httpServer = app.listen(8000);

const io = new Server(httpServer);

let history = [];
io.on("connection", (socket) => {
    console.log('Client Connected ', socket.id);

    socket.emit('history', history);

    socket.on('clear-canvas', () => {
        socket.broadcast.emit("clear-canvas");
    });
    socket.on('chat-message', (data) => {
        console.log(`Message from ${socket.id}: ${data}`);
        socket.broadcast.emit("new-message", `Message from ${socket.id}: ${data}`);
        // to send to all clients
        // io.emit("new-message",`Message from ${socket.id}: ${data}`);
    });

    socket.on('drawing', (data) => {
        history.push(data);
        console.log(history);
        socket.broadcast.emit('new-drawing', data);
    })

    socket.on('disconnect', () => console.log('Client disconnected'));
});
