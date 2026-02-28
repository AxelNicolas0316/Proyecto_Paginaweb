// backend/middlewares/methodNotAllowed.js
module.exports = function (app) {
  return function methodNotAllowed(req, res, next) {
    try {
      if (!app || !app._router || !app._router.stack) return next();

      const allowed = new Set();
      let matched = false;

      app._router.stack.forEach((layer) => {
        if (!layer || !layer.route) return;
        const route = layer.route;

        // layer.regexp exists and can test the path (works for params)
        if (layer.regexp && layer.regexp.test(req.path)) {
          matched = true;
          Object.keys(route.methods || {}).forEach((m) => allowed.add(m.toUpperCase()));
        }
      });

      if (matched && !allowed.has(req.method)) {
        return res.status(405).json({
          success: false,
          error: 'Method Not Allowed',
          message: `Method ${req.method} not allowed on ${req.path}`,
          allowed: Array.from(allowed),
        });
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};
