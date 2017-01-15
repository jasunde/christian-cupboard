require('dotenv').config()
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// source routes
var isUser = require('./routes/isUser')
var users = require('./routes/users')
var categories = require('./routes/categories')
var contacts = require('./routes/contacts')
var donations = require('./routes/donations')

// custom middleware
var decoder = require('./modules/decoder')
var userInfo = require('./modules/userInfo')
var isAdmin = require('./modules/isAdmin')

app.set('port', process.env.PORT || '3000');

// middleware


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

app.use(express.static('public'));

app.use(bodyParser.json())
app.use(decoder)
app.use(userInfo)

// general user routes
app.use('/contacts/email', isUser)
app.use('/categories', categories)
app.use('/contacts', contacts)
app.use('/donations', donations)

app.use(isAdmin)

// admin user routes
app.use('/users', users)

app.listen(app.get('port'), function () {
  console.log('Listening on port', app.get('port'));
});
