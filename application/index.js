var express = require('express');
var app = express();
var http = require('http').Server(app);
var game = require('./app.js');

global.io = require('socket.io')(http);

//Serve static client files
app.use(express.static('client'));

app.get('/', function(req, res){
  res.sendFile('index.html');
});

io.on('connection', function(socket){
  game.initGame(io, socket);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
