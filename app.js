const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
let connectedCount = 0;
let userDataRaw = fs.readFileSync("users.json");
let userData = JSON.parse(userDataRaw);

app.use(express.static('public/'));

io.on('connect', (socket) => {
    console.log('a user connected');
    ++connectedCount;
    socket.emit('message', 'socket connected');
    io.sockets.emit('connectedCount', connectedCount);
    socket.emit('data', userData);

    socket.on("adduser", (msg) => {
        console.log("adduser emitted");
        userData.users["test"+ new Date()] = {
                "name": "test",
                "available": true,
                "hasKey": false,
                "hasRadio": false,
                "notes": ""
            };
        socket.emit("data", userData);
    });

    socket.on('disconnect', () => {
        --connectedCount;
        io.sockets.emit('connectedCount', connectedCount);
        console.log('user disconnected');
    })
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});