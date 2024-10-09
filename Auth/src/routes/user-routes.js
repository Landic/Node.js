import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser } from '../middlewars/createuser-middleware.js';
import { users } from '../data/users.js';
import { authUser } from '../middlewars/authuser-middleware.js';

const userRoutes = Router();
const ACCESS_TOKEN_SECRET = 'your_access_token_secret';
const REFRESH_TOKEN_SECRET = 'your_refresh_token_secret';
let refreshTokens = [];

userRoutes
    .route('/signin')
    .get((req, res) => {
        res.render('form_auth');
    })
    .post(authUser, (req, res) => {
        const user = users.find(u => u.login === req.body.login);

        if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(403).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ login: user.login }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ login: user.login }, REFRESH_TOKEN_SECRET);

        refreshTokens.push(refreshToken); 
        res.json({ accessToken, refreshToken });
    });

userRoutes
    .route('/signup')
    .get((req, res) => {
        res.render('form_register');
    })
    .post(createUser, (req, res) => {
        const hash = bcrypt.hashSync(req.body.password, 10);
        const newUser = {
            login: req.body.login,
            email: req.body.email,
            password: hash,
        };

        users.push(newUser);
        res.status(201).json({ message: 'User registered successfully' });
    });

userRoutes.post('/token', (req, res) => {
    const { token } = req.body;

    if (!token || !refreshTokens.includes(token)) {
        return res.status(403).json({ message: 'Refresh token not valid' });
    }

    jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });

        const accessToken = jwt.sign({ login: user.login }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    });
});

userRoutes.get('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token); 
    res.clearCookie('connect.sid'); 
    res.redirect('/'); 
});


export default userRoutes;
