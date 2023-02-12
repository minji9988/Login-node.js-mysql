const http = require('http');
 
http.createServer((req, res) => {
  res.write('<h1> HTTP Module</h1>');
  res.end('The http module handles requests from web browsers..');
})
 
  .listen(8080);


// const express = require('express');
// const app = express();

// app.get('/', (req, res) => {
//   res.send('안녕 세상아!!!!!');
// });

// app.listen(8080);