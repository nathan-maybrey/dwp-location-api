const app = require('express')();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger-spec');
const { LOG_LEVEL } = require('./lib/config');
const prepareLogging = require('./bootstrap/prepare-logging');
const baseLogger = require('./bootstrap/base-logger')(LOG_LEVEL);

const usersRoutes = require('./controllers/users/routes');
const errorHandler = require('./controllers/errors/routes');

// Set up logger for all requests
prepareLogging(app, baseLogger);

// Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec.swaggerSpec));

// Users middleware
app.use('/users', usersRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
