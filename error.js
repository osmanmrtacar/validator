class ErrorHandler extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
}

const handleError = (error, request, response, next) => {
  return response.status(error.status || 500).json({
    code: error.status,
    msg: "error",
    error: {
      message: error.message || "Oops! Something went wrong."
    }
  });
};

module.exports = {
  ErrorHandler,
  handleError
};
