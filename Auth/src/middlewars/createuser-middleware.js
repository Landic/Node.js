import { users } from '../data/users.js';
import bcrypt from 'bcrypt';
import validator from 'validator';

export const createUser = (req, res, next) => {
    const { login, email, password, confirm_password } = req.body;

    if (!validator.isAlphanumeric(login) || validator.isEmpty(login)) {
        return res.render('form_register', {
            error: 'Invalid login format',
            login,
            email,
        });
    }

    if (!validator.isEmail(email)) {
        return res.render('form_register', {
            error: 'Invalid email format',
            login,
            email,
        });
    }

    if (!validator.isLength(password, { min: 6 })) {
        return res.render('form_register', {
            error: 'Password must be at least 6 characters long',
            login,
            email,
        });
    }

    if (password !== confirm_password) {
        return res.render('form_register', {
            error: 'Passwords do not match',
            login,
            email,
        });
    }

    const userExists = users.find(
        (user) => user.login === login || user.email === email,
    );
    if (userExists) {
        return res.render('form_register', {
            error: 'User with this login or email already exists',
            login,
            email,
        });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: users.length + 1,
        login,
        email,
        password: hashedPassword, 
    };

    users.push(newUser); 
    req.session.user = {
        login,
        email,
    };
    res.redirect('/'); 
};
