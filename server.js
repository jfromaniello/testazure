var http = require("http"),
    mongodb = require("mongodb");

var mongoServer = new mongodb.Server("ds035747-a.mongolab.com", 35747, {auto_reconnect: true}),
    dbConnector = new mongodb.Db("testauth", mongoServer, {});

console.log("connecting");
dbConnector.open(function(err, db){
  if(err){
    return console.log(err);
  }
  console.log("authenticating");
  db.authenticate("testuser", "testpass", function(err){
    if(err){
      return console.log(err);
    }
    console.log("inserting sample data");
    db.collection("test").insert([
      {foo: 1, bar: 2},
      {foo: 1, bar: 2}
    ], function(err, results){
      startHttpServer(db);
    });
  });
});

function startHttpServer(db){
  console.log("starting web server");

  http.createServer(function(request, response){
  
    db.collection("test").find({}).toArray(function(err, results){
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end(err || JSON.stringify(results, null , 2));
    });

  }).listen(process.env.port || 8989, function(){
    console.log("running in http://localhost:" + (process.env.port || 8989).toString());
  });
}