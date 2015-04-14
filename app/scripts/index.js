/*client connect*/
var socket = io();

var userName = '';
$('#nameSubmit').on('click',function(){
   userName = $('#nameInput').val();
  for(var i = 0,len=userCon.users.length;i<len;i++){
    if(userCon.users[i].name == userName){
      alert('用户名已被使用！')
      return;
    }
  }
  $('#logModal').modal('hide');
  socket.emit('newUser',userName);
})

/*vue*/
var msgCon = new Vue({
  el:'#msgCon',
  data:{
    msgs:[
      
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
  var msgs = {
    all:[]
  };
  msgCon.msgs = msgs.all;
  $('#msgForm').submit(function(){
    var $msgInput = $('#msgInput');
    var target = $('#msgCon').data('target');
    if(target === 'multi'){
      socket.emit('sendAllMessage',$msgInput.val(),userName);
    }else{
      socket.emit('sendOneMessage',$msgInput.val(),userName,target);
    }
    $('#msgInput').val('');
    return false;
  })
  socket.on('sendAllMessage',function(msg){
    msgs.all.push(msg);
    console.log(msg);
    /*msgCon.msgs.push(msg);*/
  });
  socket.on('sendOneMessage',function(msg,target){
    if(target){
      msgs[target].push(msg);
    }else{
      if(!msgs[msg.name])  msgs[msg.name] = [];
      msgs[msg.name].push(msg);
      if(msg.name === $('#msgCon').data('target'))
        return;
      for(var i = 0,len=userCon.users.length;i<len;i++){
        if(userCon.users[i].name === msg.name){
          userCon.users.$set(i,{
            name:userCon.users[i].name,
            badge:'news'
          })
        }
      }
    }
  })
  socket.on('newUser',function(user){
    msgCon.msgs.push({
      name:user.name,
      time:user.time,
      text:'新用户'+user.text+'加入了聊天室'
    })
    userCon.users.unshift({
      name:user.text
    })
  })
  socket.on('welcome',function(users){
    /*login*/
    $('#logModal').modal({
    });
    for(var i = 0,len=users.length;i<len;i++){
      userCon.users.unshift({
        name:users[i]
      });
    }
    socket.on('userDisconnect',function(users,disconnectUser){
      msgCon.msgs.push({
        name:disconnectUser.name,
        time:disconnectUser.time,
        text:'用户'+disconnectUser.text+'离开了聊天室'
      })
      for(var i = 0,len=userCon.users.length;i<len;i++){
        if(userCon.users[i].name === disconnectUser.text){
          userCon.users.splice(i,1);
          len--;
        }
      }
    })
  })

  /*change chat status*/
  $('#onLineUsers').on('click','li',function(ev){
    var $elm = $(ev.currentTarget);
    var selectName = $elm.html().substring(0,$elm.html().indexOf('<'));
    if($elm.hasClass('user')){
      if(selectName === userName){
        alert('不能与自己聊天的');
        return;
      }
      if(!($('#msgCon').data('target') === selectName)){
        $('#chatStatus').html('与'+selectName+'聊天中');
        $('#msgCon').data('target',selectName);
        if(!msgs[selectName]) msgs[selectName] = [];
        msgCon.msgs = msgs[selectName];
        for(var i = 0,len=userCon.users.length;i<len;i++){
          if(userCon.users[i].name === selectName){
            userCon.users.$set(i,{
              name:selectName,
              badge:''
            })
          }
        }
      }
      return;
    }
    if($elm.hasClass('mulTalk')){
      if(!($('#msgCon').data('target') === 'multi')){
        $('#msgCon').data('target','multi');
        $('#chatStatus').html('现在正在群聊中');
        msgCon.msgs = msgs.all;
      }
    }
  })