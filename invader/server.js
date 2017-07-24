/**
 * Socket.ioを使用した簡易サバ
 担当者　中東
 */

//--------------------------------------
// モジュール読み込み
//--------------------------------------
var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

//--------------------------------------
// Webサーバ
//--------------------------------------
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/image/:file', function(req, res){
  res.sendFile(__dirname + '/resource/' + req.params.file);
});
app.get('/js/:file', function(req, res){
  res.sendFile(__dirname + '/js/' + req.params.file);
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});

//--------------------------------------
// Socket.io
//--------------------------------------
io.on('connection', function(socket){
  //接続時のメッセージ
  console.log('a user connected');

  //ポジションデータ1
  socket.on('moveChar1', function(data){
    io.emit('moveChar1', data);
	//console.log('posData:' + data);
  });
  //ポジションデータ2
  socket.on('moveChar2', function(data){
    io.emit('moveChar2', data);
	//console.log('posData:' + data);
  });

  //ショットデータ1
  socket.on('shotChar1', function(data){
    io.emit('shotChar1', data);
	  //console.log('shot:' + data);
  });
  //ショットデータ2
  socket.on('shotChar2', function(data){
    io.emit('shotChar2', data);
	  //console.log('shot:' + data);
  });

  //切断
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
