import express from 'express';
import 'dotenv/config';
import product_routes from './routers/product-routers.js';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.redirect('/products');
});

app.use('/products', product_routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});