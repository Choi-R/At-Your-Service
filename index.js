const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const swagger = require('swagger-ui-express')
const documentation = require('./swagger.json')
const { notFound, internalServerError } = require('./helpers/errorHandle.js')

const mongoose = require("mongoose").set('debug', true);
var morgan = require("morgan");
const indexRoutes = require('./routes')
require('dotenv').config()

mongoose.set('useFindAndModify', false)

const env = process.env.NODE_ENV;
const dbConnectionString = {
  development: process.env.DB_CONNECTION,
  test: process.env.DB_CONNECTION_TEST,
  staging: process.env.DB_CONNECTION_STAGING,
  production: process.env.DB_CONNECTION_PRODUCTION
};

console.log(dbConnectionString[env]);

app.use(morgan("tiny"));

mongoose
  .connect(dbConnectionString[env], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));

app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.status(200).json({
      status: true,
      data: 'Welcome to Buku Saku API'
  })
})

app.use('/documentation', swagger.serve, swagger.setup(documentation))

app.get('/api/v1/user/resetPassword/:token', function (req, res) {  
  res.render('resetPassword', {url: req.originalUrl})
})
app.get('/user/confirmed', function (req, res) {  
  res.render('index')
})
app.get('/user/reset', function (req, res) {  
  res.render('reset')
})
app.use('/api/v1', indexRoutes);
app.use(notFound);
app.use(internalServerError);

module.exports = app;