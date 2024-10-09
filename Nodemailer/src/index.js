import express from "express";
import exphbs from "express-handlebars";
import cookieParser from "cookie-parser";
import path from "node:path";
import session from "express-session";
import "dotenv/config";
import siteRoutes from "./routes/site-routes.js";
import userRoutes from "./routes/user-routes.js";
import checkUser from "./middlewars/checkuser-middleware.js";
import bodyParser from "body-parser";
const PORT = process.env.PORT || 3000;
//#region options for hbs
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});
//#endregion
const server = express();
server.use(express.static("photos"));
server.use(express.static("public"));
//server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //   maxAge: 10000,
    // },
  })
);

server.use(checkUser);
server.use(express.json());
//#region handlebars
server.engine("hbs", hbs.engine);
server.set("view engine", "hbs");
server.set("views", path.join("src", "views"));
//#endregion

server.use(express.static("public"));

server.use(siteRoutes);
server.use("/user", userRoutes);
server.listen(PORT, () =>
  console.log(`Server is running http://localhost:${PORT}`)
);
