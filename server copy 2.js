// server.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  //res.sendFile(path.join(__dirname, '', 'index.html'));

});

app.get('/about', (req, res) => {
    res.send('Hello about test nodemon');
});
app.listen(3000);