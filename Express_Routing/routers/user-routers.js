import { Router } from 'express';

const user_routes = Router();
const users = {
    users: [
        { id: 1, name: 'Alex' },
        { id: 2, name: 'John' },
    ],
};
user_routes
    .route('/')
    .get((req, res) => {
        res.json(users);
    })
    .post((req, res) => {})
    .delete((req, res) => {});

user_routes
    .route('/:id_user')
    .get((req, res) => {
        const id = +req.params.id_user;
        const user = users.users.find((el) => el.id === id);
        res.json(user);
    })
    .delete((req, res) => {})
    .put((req, res) => {});

export default user_routes;
