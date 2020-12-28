// eslint-disable
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
// const path = require('path');
const fs = require('fs');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'static')));

// app.use(express.static(__dirname));

app.get('/shaders', (req, res) => {
  const list = fs.readdirSync('static/shaders', 'utf-8');
  res.status(200).send({ status: 200, data: list });
  res.end();
});

// app.get('/a.out.worker.js', (req, res) => {
//   res.sendFile(path.join(__dirname, 'src/liquidfun/a.out.worker.js'));
// });
// app.get('/a.out.wasm', (req, res) => {
//   res.sendFile(path.join(__dirname, 'src/liquidfun/a.out.wasm'));
// });
// app.get('/liquidfun.worker.js', (req, res) => {
//   res.sendFile(path.join(__dirname, 'static/liquidfun/liquidfun.worker.js'));
// });
// app.get('/dist/worker.js', (req, res) => {
//   console.log('SENDING WORKER');
//   res.sendFile(path.join(__dirname, 'dist/worker.js'));
// });
app.get('/liquidfun.wasm', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/liquidfun/liquidfun.wasm'));
});
// app.get('/dist/liquidfun.wasm', (req, res) => {
//   res.sendFile(path.join(__dirname, 'static/liquidfun/liquidfun.wasm'));
// });

// app.listen(5555, () => {
//   console.log('Server 5555');
// });

/**
 * @todo:
 * Uncomment app.listen and express.static above,
 * and remove socket.io code below if testing mobile
 * devices is no longer needed.
 * Also delete index.html and rename __index.html
 * to index.html
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'socket/index.html'));
});
app.use(express.static(__dirname));
app.use(express.static(__dirname));

const http = require('http').createServer(app);
// const io = require('socket.io')(http);

// io.on('connection', (socket) => {
//   console.log('socket connected');

//   socket.on('event', (evt) => socket.broadcast.emit('event', evt));
// });

http.listen(5555, '0.0.0.0', () => {
  console.log('Server started on port 5555');
});
