var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path')

var wilddog = require('wilddog')
var config = {
    syncURL: "https://wd7570302339fmrtqa.wilddogio.com" //输入节点 URL
  };
  wilddog.initializeApp(config);
  var wilddogRef = wilddog.sync();
  var apiInfo = wilddogRef.child("apiInfo")
  // apiInfo.set({});


var static={
  sum:function(json){
    let key="",sum=0
    for (key in json){
      sum++
    }
    return sum
  },
  find:function(device_sn,json){
    let key="",arr=[]
    for (key in json){
      if(json[key].deviceId===device_sn){
        arr.push(json[key])
      }
    }
    return arr
  },
}
var info={
  data:"",
  sum:''
}

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))

});

app.get('/data', function (req, res) {
  console.log(req.query);
  if(req.query){
    apiInfo.push(req.query);
  }
  res.end('ok')
});
app.get('/dataOut', function (req, res) {
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  apiInfo.once("value").then(function(snapshot){
    console.info();
    var data =snapshot.val()
    info.data=data;
    info.sum=static.sum(data)
    res.end(JSON.stringify({sum: info.sum,data:data}))
}).catch(function(err){
    console.error(err);
})
 
});
io.on('connection', (socket) => {
  console.log('socket connected')
  socket.on('disconnect', () => {
    console.log('disconnect')
  })
  socket.on('message',(msg)=>{
    console.log('msg:'+msg)
    if(msg=='sum'){
      io.emit('message','sum='+(info.sum?info.sum:'error'))
    }else if(msg.search('dtu=')===0)
    {
    var findR=  static.find(msg.split("dtu=")[1],info.data)
    io.emit('message',JSON.stringify(findR))
    }
    else{
    io.emit('message',"无法识别")
      
    }
  });
});

app.set('port', process.env.PORT || 3000);

var server = http.listen(app.get('port'), function() {
  console.log('start at port:' + server.address().port);
});