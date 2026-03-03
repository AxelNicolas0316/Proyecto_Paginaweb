// backend/middlewares/errorHandler.js
module.exports = {
  notFound: (req, res, next) => {
    res.status(404).json({ success: false, error: 'Not Found', message: 'Route not found' });
  },

  errorHandler: (err, req, res, next) => {
    console.error(err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (status === 401) {
      return res.status(401).json({ success: false, error: 'Unauthorized', message });
    }

    if (status === 403) {
      return res.status(403).json({ success: false, error: 'Forbidden', message });
    }

    if (status === 404) {
      return res.status(404).json({ success: false, error: 'Not Found', message });
    }

    res.status(status).json({ success: false, error: 'Server Error', message });
  }
};
