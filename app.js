var express = require('express');
var path = require('path');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var pages = require('./routes/pages.js');
var adminPages = require('./routes/admin_pages.js');

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

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Express Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use('/', pages);
app.use('/admin/pages', adminPages);

//Start server
var port = 3000;

app.listen(port, ()=>{
    console.log('Servidor rodando na porta 3000');
})
