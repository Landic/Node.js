import { users } from "../data/users.js";
import bcrypt from "bcrypt";

export const authUser = (req, res, next) => {
  const { login, password } = req.body;
  const user = users.find((el) => el.login === login);
  if (user && bcrypt.compareSync(password, user.password)) {
    req.body.email = user.email;

    next();
    return;
  }
  res.status(400);
  res.redirect("/");
};
