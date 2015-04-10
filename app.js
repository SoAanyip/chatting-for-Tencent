var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

/*define where static files are*/
app.use(express.static(__dirname + '/app'));

/*app.use(function(req,res){
	res.sendFile(path.join(__dirname, '/app', 'index.html'));
	//res.sendfile('./app/index.html');
})*/
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/app', 'index.html'));
});

/*server functions*/
io.on('connection',function(socket){
	console.log('an user here!');
	socket.broadcast.emit('welcome');
	socket.on('sendAllMessage',function(msg){
		io.emit('sendAllMessage',msg);
		console.log('message:' + msg);
	});
	socket.on('disconnect',function(){
		console.log('an user left!');
	});
})

/*get start*/
http.listen(3000, function(){
  console.log('listening on *:3000');
});