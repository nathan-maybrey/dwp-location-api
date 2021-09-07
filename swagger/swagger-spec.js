const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.1',
  info: {
    title: 'DWP Location API Test - Nathan Maybrey',
    description: 'An API which returns people either living in city or within configurable distance of city',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Picks up routes which have OpenAPI annotations
  apis: ['./controllers/**/*.js'],
};

module.exports.swaggerSpec = swaggerJSDoc(options);
