const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const error = { ...err };
  error.message = err.message;

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error.message = message;
    res.status(400).json({ success: false, message });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
