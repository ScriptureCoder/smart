const http = require('./binary');
const port = process.env.PORT || 5000;
const cluster = require('cluster');
const os = require('os');

if (!cluster.isMaster) {
   const cpuCount = os.cpus().length;
   for (let i = 0; i < cpuCount; i++) {
      cluster.fork();
   }
}
else {
   http.listen(port);
}

cluster.on('online', function(worker) {
   console.log(`Worker ${worker.process.pid} is listening on port ${port}`);
});

cluster.on('exit', (worker) => {
   console.log(worker.id, ' is no more!');
   cluster.fork()
});
