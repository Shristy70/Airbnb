module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = originalUrl;
    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirect = (req, res) => {
  if (req.session.redirectUrl) {
    res.locals.session = req.session.redirectUrl;
  }
  next();
};
