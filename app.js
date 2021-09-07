const app = require('express')();
const { LOG_LEVEL } = require('./lib/config');
const prepareLogging = require('./bootstrap/prepare-logging');
const baseLogger = require('./bootstrap/base-logger')(LOG_LEVEL);

// Set up logger for all requests
prepareLogging(app, baseLogger);

app.get('/', (req, res, next) => {
  res.status(200).send('App working');
  next();
});

module.exports = app;
