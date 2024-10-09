import { users } from "../data/users.js";
import bcrypt from "bcrypt";
import path from "node:path";
export const createUser = (req, res, next) => {
  if (
    req.body &&
    req.body.login &&
    req.body.email &&
    req.body.password &&
    req.body.confirm_password &&
    req.body.password === req.body.confirm_password
  ) {
    const { login, email, password } = req.body;
    const user = users.find((el) => el.login === login || el.email === email);
    const salt = bcrypt.genSaltSync(10);
    if (!user) {
      users.push({
        id: users.length + 1,
        login: login,
        email: email,
        password: bcrypt.hashSync(password, salt),
        image: login + path.extname(req.file.originalname),
      });
      next();
      return;
    }
  }
  res.status(400);
  res.redirect("/");
};
