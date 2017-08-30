function loggedOut(req, res, next) {
  if (req.session && req.session.userId) { // If both are true, then user is logged in
    return res.redirect('/profile');
  }
  return next(); // If visitor is not logged in, then this middleware does nothing
}

function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    let err = new Error('You must be logged in to view this page!');
    err.status = 401;
    next(err);
  }
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
