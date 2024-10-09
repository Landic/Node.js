import express from 'express';
import exphbs from 'express-handlebars';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import session from 'express-session';
import 'dotenv/config';
import siteRoutes from './routes/site-routes.js';
import userRoutes from './routes/user-routes.js';
import checkUser from './middlewars/checkuser-middleware.js';


const PORT = process.env.PORT || 3000;

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
});

const server = express();
server.use(cookieParser());
server.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 10000,
        },
    }),
);
server.use(checkUser);
server.use(express.json());
server.engine('hbs', hbs.engine);
server.set('view engine', 'hbs');
server.set('views', path.join('src', 'views'));
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));

server.use(siteRoutes);
server.use('/user', userRoutes);
server.listen(PORT, () =>
    console.log(`Server is running http://localhost:${PORT}`),
);
