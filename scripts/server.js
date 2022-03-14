const createAppConfigJs = require('./../config/createconfig');
const express = require('express');
const path = require('path');
const paths = require('./../config/paths');

const envFileSuffix = process.argv[2] || 'production';
const app = express();
const PORT = 3000;

createAppConfigJs(envFileSuffix, paths.appBuild);

app.use(express.static(path.resolve('build')));

app.get('/*', function fn(req, res) {
  res.sendFile(path.resolve('build', 'index.html'));
});

app.listen(PORT);

console.log(`App running at http://localhost:${PORT}`);
