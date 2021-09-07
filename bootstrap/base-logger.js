/**
 * Base logger from which child loggers can be created from.
 */
const os = require('os');
const pino = require('pino');
const packageInfo = require('../package.json');

module.exports = (logLevel) => pino({
  base: {
    pid: process.pid,
    hostname: os.hostname(),
    app: {
      name: packageInfo.name,
      version: packageInfo.version,
    },
  },
  level: logLevel,
  messageKey: 'message',
  timestamp: () => `,"time":"${(new Date()).toISOString()}"`,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
});
