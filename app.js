var express = require('express');
var app = express();
var http = require('http').Server(app);
//var http = require('http');
var io = require('socket.io')(http);
var path = require('path');
//var session = require('express-session');

/*set port*/
app.set('port', process.env.PORT || 3000);

/*define where static files are*/
app.use(express.static(__dirname + '/app'));
//app.use(express.static(path.join(__dirname, 'app')));

/*session settings*/
/*app.use(session({
  secret: 'chatting',
  cookie: { maxAge: 60000*60*24*7 }
}))

app.use(function(req,res){
	console.log('11111111111111111');
	console.log(req.session);
})*/

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/app', 'index.html'));
});

/*server functions*/
var num = 0;
io.on('connection',function(socket){
	console.log('an user here!');
	socket.broadcast.emit('welcome');
	socket.on('sendAllMessage',function(text,name){
		/*text.split('\/n').join('<br/>');*/
		var date = new Date();
		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		if(hour.length === 1) hour = '0'+hour;
		if(min.length === 1) min = '0'+min;
		if(sec.length === 1) sec = '0'+sec;
		var msg = {
			name:name,
			time:hour+':'+min+':'+sec,
			text:text
		}
		io.emit('sendAllMessage',msg);
		console.log('message:' + text);
	});
	socket.on('newUser',function(name){
		var date = new Date();
		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		if(hour.length === 1) hour = '0'+hour;
		if(min.length === 1) min = '0'+min;
		if(sec.length === 1) sec = '0'+sec;
		var user = {
			time:hour+':'+min+':'+sec,
			name:name
		}
		io.emit('newUser',user);
	})
	socket.on('disconnect',function(){
		console.log('an user left!');
	});
})

/*io.set('authorization',function(handshakeData,accept){
	console.log(handshakeData.headers);
	accept(null,true);
});	*/

/*get start*/
http.listen(app.get('port'), function(){
  console.log('listening on '+ app.get('port'));
});