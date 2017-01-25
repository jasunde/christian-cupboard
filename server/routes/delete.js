var express = require('express');
var router = express.Router();
var pg = require('pg');

var config = require('../config');

var pool = new pg.Pool(config.pg);
