const checkUser = (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user.login;
    res.locals.email = req.session.user.email;
  }
  next();
};
export default checkUser;
