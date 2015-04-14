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
var clients = {
	sockets:[],
	users:[]
};
io.on('connection',function(socket){
	console.log('an user here!');
	socket.emit('welcome',clients.users);
	/*sending messages*/
	socket.on('sendAllMessage',function(text,name){
		/*text.split('\/n').join('<br/>');*/
		var msg = {
			name:name,
			time:getTime(),
			text:text
		}
		io.emit('sendAllMessage',msg);
		console.log('messageToAll:' + text);
	});
	socket.on('sendOneMessage',function(text,name,target){
		var msg = {
			name:name,
			time:getTime(),
			text:text
		}
		for(var i = 0;i<clients.sockets.length;i++){
			if(clients.users[i] === target){
				socket.emit('sendOneMessage',msg,target);
				clients.sockets[i].emit('sendOneMessage',msg);
			}
		}
		console.log('messageTo'+target+':' + text);
	})
	socket.on('newUser',function(name){
		var user = {
			time:getTime(),
			name:'系统',
			text:name
		}
		clients.sockets.push(socket);
		clients.users.push(name);
		io.emit('newUser',user);
	})
	socket.on('disconnect',function(){
		console.log('an user left!');
		var name = '';
		for(var i = 0;i<clients.sockets.length;i++){
			if(clients.sockets[i] === socket){
				name = clients.users[i];
				clients.sockets.splice(i,1);
				clients.users.splice(i,1);

			}
		}
		var disconnectUser = {
			time:getTime(),
			name:'系统',
			text:name
		}
		io.emit('userDisconnect',clients.users,disconnectUser);
	});
})

/*io.set('authorization',function(handshakeData,accept){
	console.log(handshakeData.headers);
	accept(null,true);
});	*/

function getTime(){
	var date = new Date();
	var hour = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();
	if((''+hour).length === 1) hour = '0'+hour;
	if((''+min).length === 1) min = '0'+min;
	if((''+sec).length === 1) sec = '0'+sec;
	return hour+':'+min+':'+sec;
}

/*get start*/
http.listen(app.get('port'), function(){
  console.log('listening on '+ app.get('port'));
});