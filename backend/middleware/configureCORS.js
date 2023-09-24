const configureCORS = (req, res, next) => {
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS;
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', allowedOrigins);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  res.header(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, PATCH, DELETE, OPTIONS'
  );
  res.header('Access-Control-Allow-Credentials', true);
  next();
};

export default configureCORS;
