var express = require('express');
var path = require('path');
var config = require('./config/database');

//MongoDM Connector
var mongoose = require('mongoose');
mongoose.connect(config.database);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Banco conectado com sucesso');
});

//Init app
var app = express();

app.get('/', (req, res)=>{
    res.send('Ola Mundo');
});

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Start server
var port = 3000;

app.listen(port, ()=>{
    console.log('Servidor rodando na porta 3000');
})
