require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// configuracion  global de rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.urlDB,
  { useNewUrlParser: true, useCreateIndex: true },
  (err, resp) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
    console.log(process.env.urlDB);
  });

app.listen(process.env.PORT, () => {
  console.log('Escuchando el puerto: ', 3000);
});