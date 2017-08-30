function loggedOut(req, res, next) {
  if (req.session && req.session.userId) { // If both are true, then user is logged in
    return res.redirect('/profile');
  }
  return next(); // If visitor is not logged in, then this middleware does nothing
}

module.exports.loggedOut = loggedOut;
