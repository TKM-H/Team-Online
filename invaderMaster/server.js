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
  res.sendFile(__dirname + '/title2.html');
});

app.get('/html/wait.html', function (req, res) {
    res.sendFile(__dirname + '/wait.html');
});

app.get('/html/game.html', function (req, res) {
    res.sendFile(__dirname + '/game.html');
});

app.get('/html/gameClear.html', function (req, res) {
    res.sendFile(__dirname + '/gameClear.html');
});

app.get('/html/gameOver.html', function (req, res) {
    res.sendFile(__dirname + '/gameOver.html');
});

app.get('/Images/:file', function(req, res){
  res.sendFile(__dirname + '/Images/' + req.params.file);
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

  //接続人数
  socket.on('connectNo', function(data){
    console.log(data);
    io.emit('connectNo', data);
	//console.log('posData:' + data);
  });

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

  //勝敗判定
  socket.on('gameEnd', function(data){
    io.emit('gameEnd', data);
	//console.log('posData:' + data);
  });

  //切断
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
