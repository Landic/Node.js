import { Router } from 'express';
import path from 'node:path';

const __filename = import.meta.filename;
const __dirname = path.dirname(__filename);
const product_routes = Router();

let products = [
    { id: 1, name: 'Phone', price: 100 },
    { id: 2, name: 'TV', price: 200 },
];

product_routes.route('/').get((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'form.html'));
});

product_routes.route('/').post((req, res) => {
    const { name, price } = req.body;
    console.log(name, price);
    const newProduct = {
        id: products.length + 1,
        name,
        price: parseFloat(price),
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

product_routes.get('/view', (req, res) => {
    res.json(products);
});

product_routes.get('/view/:id', (req, res) => {
    const { id } = req.params;
    res.json(products.find((p) => p.id === parseInt(id)));
});

product_routes.route('/').put((req, res) => {
    const { id } = req.body;
    const { name, price } = req.body;
    const product = products.find((p) => p.id === parseInt(id));

    if (product) {
        product.name = name;
        product.price = parseFloat(price);
        res.json({ status: 'success', product });
    } else {
        res.status(404).json({
            status: 'error',
            message: 'Product not found',
        });
    }
});

product_routes.route('/').delete((req, res) => {
    const { id } = req.body;
    const index = products.findIndex((p) => p.id === parseInt(id));

    if (index !== -1) {
        const deletedProduct = products.splice(index, 1);
        res.json({ status: 'success', product: deletedProduct });
    } else {
        res.status(404).json({ status: 'error', message: 'Product not found' });
    }
});

export default product_routes;
