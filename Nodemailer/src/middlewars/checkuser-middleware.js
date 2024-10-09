import { users } from "../data/users.js";

const checkUser = (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user.login;
    res.locals.email = req.session.user.email;
    res.locals.image =
      "/" + users.find((el) => el.login === req.session.user.login).image;
  }
  next();
};
export default checkUser;
