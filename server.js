var http = require('http');

var server = http.createServer(function(req, res) {
  console.log('query', req.query)
  console.log('headers', req.headers)
});

server.listen(3000);
