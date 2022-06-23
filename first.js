const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('./startup/routes')(app);

// process.on('uncaughtException',(ex) => {
//     console.log('we got a error:',ex);
// );

mongoose.connect('mongodb://localhost/play')
.then(()=>console.log('database connected....'))
.catch( err => console.log('could not connected error',err));

app.listen(3000, () => console.log('listeninn in port 3000'));
