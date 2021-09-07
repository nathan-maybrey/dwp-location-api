module.exports = (app, baseLogger) => {
  app.use((req, res, next) => {
    // Create a logger for all requests. Available by using 'req.log.*'
    // (info, warn, etc).
    req.log = baseLogger;
    next();
  });
};
