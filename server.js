// eslint-disable
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const path = require('path');
const fs = require('fs');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(__dirname));

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
app.get('/liquidfun.worker.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/liquidfun/liquidfun.worker.js'));
});
app.get('/liquidfun.wasm', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/liquidfun/liquidfun.wasm'));
});

app.listen(5555, () => {
  console.log('Server 5555');
});
