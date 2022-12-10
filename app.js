var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
const cors = require('cors')
var {mongo_uri} = require('./config/database')

mongoose.connect(mongo_uri)
.then(()=>{
    console.log('----> SUCCESSFUL CONNECTION TO DATABASE')
}).catch(err =>{
    console.log('FAILED TO CONNECT TO DATABASE, REASON ---->', err)
})


var app = express();

app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/api/user', require('./components/User/router'))
app.use('/api/game', require('./components/Game/router'))
app.use('/api/category', require('./components/Category/router'))
app.use('/api/cart', require('./components/Cart/router'))

module.exports = app;
