var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path')

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))

});
app.get('/data', function (req, res) {
 

});
io.on('connection', (socket) => {
  console.log('socket connected')
  socket.on('disconnect', () => {
    console.log('disconnect')
  })
  socket.on('chat message',(msg)=>{
    console.log('msg:'+msg)
    io.emit('chat message',msg)
  });
});

app.set('port', process.env.PORT || 3000);

var server = http.listen(app.get('port'), function() {
  console.log('start at port:' + server.address().port);
});