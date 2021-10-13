let express = require("express");
let cluster = require("cluster");
let os = require("os");
let app = express();

let cpuCOunt = os.cpus().length;

app.get("/", (req, res) => {
  res.send("Hello World");
});

if (cluster.isMaster) {
  for (let i=0; i<cpuCOunt; i++ ) {
    cluster.fork();
  }

  //when ever process get killed, cluster will fork another process meanse no server downtime
  cluster.on("exit",(worer, code, signal) => {
    console.log(`Worker ${cluster.process.pid} is down`);
    cluster.fork();
  });
} else {
  //all workers are listening to the the http://localhost:3000/ here
  app.listen(3000, ()=> console.log(`Server is running on port ${3000}, worer ${process.pid}`));
}