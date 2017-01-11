require('dotenv').config()
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var decoder = require('./modules/decoder');

// source routes
var users = require('./routes/users')
var categories = require('./routes/categories')
var donations = require('./routes/donations')
var distributions = require('./routes/distributions')

// custom middleware
var userInfo = require('./modules/userInfo')

app.set('port', process.env.PORT || '3000');

// middleware


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

app.use(express.static('public'));

app.use(bodyParser.json())
// app.use(decoder)
app.use(userInfo)

// route the routes
app.use('/users', users)
app.use('/categories', categories)
app.use('/donations', donations)
app.use('/distributions', distributions)

app.listen(app.get('port'), function () {
  console.log('Listening on port', app.get('port'));
});
