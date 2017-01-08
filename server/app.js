var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// source routes
var users = require('./routes/users')
var categories = require('./routes/categories')

app.use(bodyParser.json())

app.set('port', process.env.PORT || '3000');

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// route the routes
app.use('/users', users)
app.use('/categories', categories)

app.use(express.static('public'));

app.listen(app.get('port'), function () {
  console.log('Listening on port', app.get('port'));
});
