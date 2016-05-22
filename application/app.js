var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Serve static client files
app.use(express.static('client'));

app.get('/', function(req, res){
  res.sendFile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

