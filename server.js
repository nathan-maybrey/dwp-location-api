/**
 * Application entry point.
 */

const app = require('./app');
const { PORT, LOG_LEVEL } = require('./lib/config');
const logger = require('./bootstrap/base-logger')(LOG_LEVEL);

// Start the server
const server = app.listen(PORT, () => {
  const { address, port } = server.address();
  logger.info(`App listening at http://${address}:${port}`);
});
