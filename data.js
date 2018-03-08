var Sqlite = require('sqlite3')
var db=new Sqlite.Database('./test.db',function(){
    db.run("insert into api_logs values('test','test','test')",function(){
        db.all("select * from api_logs",function(err,res){  
            if(!err)  
              console.log(JSON.stringify(res));  
            else  
              console.log(err);  
          });  
    })
})