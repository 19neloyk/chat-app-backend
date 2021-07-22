var WebSocketServer = require("ws").Server;
var express = require('express');
var http = require("http");

var app = express();
var server = http.createServer(app);

server.listen(3000);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

//Now we establish the web sockets

var socket_server = new WebSocketServer({server: server, path:"/chat"});
//We will use an object array 
//To represent the chat data
//From each individual
var chat_logs = [
    {
        john: "Hey Bill"
    },
    {
        bill : "How ya doing john?"
    },
]

socket_server.on("connection", function (ws) {
    JSON.stringify(chat_logs);
    ws.send(chat_logs);

    //Message should be of form 
    /*"message" : {
        "neloy": "Hallo"
    }*/
    socket_server.on('message', function (message) {
        var formatted_message = JSON.parse(message);
        chat_logs.push (formatted_message);

        //Now, broadcast to all connected clients
        socket_server.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(message);
            }
        });
    })
});

