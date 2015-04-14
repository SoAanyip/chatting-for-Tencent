/*client connect*/
  var socket = io();

/*login*/
$('#logModal').modal({
});

var userName = '';
$('#nameSubmit').on('click',function(){
  userName = $('#nameInput').val();
  $('#logModal').modal('hide');
  socket.emit('newUser',userName);
})

/*vue*/
var msgCon = new Vue({
  el:'#msgCon',
  data:{
    msgs:[
      {
        name:'ABC',
        time:'12:23:34',
        text:'123'
      }
    ]
  }
})
var userCon = new Vue({
  el:'#onLineUsers',
  data:{
    users:[
    ]
  }
})

  /*client functions*/
  var msgs = [];
  
  $('#msgForm').submit(function(){
    var $msgInput = $('#msgInput');
   // if(!($msgInput.val().trim() === '')){
      socket.emit('sendAllMessage',$('#msgInput').val(),userName);
      $('#msgInput').val('');
   // }
    return false;
  })
  socket.on('sendAllMessage',function(msg){
    msgs.push(msg);
    console.log(msg);
    msgCon.msgs.push(msg);
  });
  socket.on('newUser',function(user){
    msgCon.msgs.push({
      name:'系统',
      time:user.time,
      text:'新用户'+user.name+'加入了聊天室'
    })
    userCon.users.unshift({
      name:user.name
    })
  })
  socket.on('welcome',function(){
  //alert('hello, welcome to this room!');
  })

  /*change chat status*/
  $('#onLineUsers').on('click','li',function(ev){
    var $elm = $(ev.currentTarget);
    if($elm.hasClass('user')){
      if(!($('#msgCon').data('target') === $elm.html())){
        $('#chatStatus').html('与'+$elm.html()+'聊天中');
        $('#msgCon').data('target',$elm.html());
      }
      return;
    }
    if($elm.hasClass('mulTalk')){
      if(!($('#msgCon').data('target') === 'mul')){
        $('#msgCon').data('target','mul');
        $('#chatStatus').html('现在正在群聊中');
      }
    }
  })