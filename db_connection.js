var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/api', routes);

app.listen(5000, function () {
    console.log('Server is running..');
});

