module.exports = (err, req, res, _next) => {
  const status = err.status || 500;

  req.log.error(`Error occurred with status: ${status}, msg: ${err.message}`);

  res.status(status).json({
    message: err.message || "An error occurred",
  });
};
